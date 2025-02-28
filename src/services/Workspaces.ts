import { arraySorted, facade } from '@noeldemartin/utils';
import { Cloud } from '@aerogel/plugin-offline-first';
import { Events, UI, translate } from '@aerogel/core';
import { fetchSolidDocument } from '@noeldemartin/solid-utils';
import { Solid } from '@aerogel/plugin-solid';
import { trackModels } from '@aerogel/plugin-soukai';
import { ref, watchEffect } from 'vue';

import LegacyTaskSchema from '@/models/legacy/LegacyTask.schema';
import Task from '@/models/Task';
import TaskSchema from '@/models/Task.schema';
import TasksLists from '@/services/TasksLists';
import Workspace from '@/models/Workspace';
import type TasksList from '@/models/TasksList';

import Service from './Workspaces.state';

export class WorkspacesService extends Service {

    public toggleSidebar(): void {
        this.sidebar = !this.sidebar;
    }

    public select(task: Task | null): void {
        this.task = task;
    }

    public async open(): Promise<void> {
        const workspace = this.all.find((model) => model.url === this.lastVisitedWorkspaceUrl) ?? this.all[0];
        const lists = await workspace?.loadRelationIfUnloaded<TasksList[]>('lists');
        const list = lists?.find((model) => model.url === TasksLists.lastVisitedListUrl);

        await workspace?.open(list);
    }

    public async migrate(): Promise<void> {
        if (!this.usingLegacySchemas) {
            return;
        }

        const progress = ref(0);

        await UI.loading(
            { progress, message: translate('settings.migrationOngoing') },
            Cloud.migrate({ onUpdated: (value) => (progress.value = value) }),
        );
    }

    protected async boot(): Promise<void> {
        await Cloud.booted;
        await Cloud.register(Workspace, { path: '/tasks/' });
        await trackModels(Workspace, {
            service: this,
            property: 'all',
            transform: (workspaces) => arraySorted(workspaces, 'name'),
        });

        Task.on('deleted', (task) => this.onTaskDeleted(task));
        Events.on('purge-storage', () => this.onPurgeStorage());
        Events.on('cloud:sync-started', () => this.onSyncStarted());
        Events.on('cloud:migration-completed', () => this.onMigrationCompleted());

        watchEffect(() => (this.lastVisitedWorkspaceUrl = this.current?.url ?? this.lastVisitedWorkspaceUrl));
        watchEffect(() => {
            const currentTask = this.task;

            if (!currentTask) {
                return;
            }

            this.task = this.current?.tasks?.find((task) => task.is(currentTask)) ?? null;
        });

        await this.bootLegacySchemas();
    }

    protected async bootLegacySchemas(): Promise<void> {
        if (!this.usingLegacySchemas) {
            return;
        }

        Cloud.registerSchemaMigration(Task, TaskSchema);

        await Task.updateSchema(LegacyTaskSchema);
    }

    protected onPurgeStorage(): void {
        this.lastVisitedWorkspaceUrl = null;
        this.usingLegacySchemas = null;
    }

    protected async onSyncStarted(): Promise<void> {
        if (this.usingLegacySchemas !== null) {
            return;
        }

        const user = Solid.user;

        if (!user?.usedLegacyApp) {
            this.usingLegacySchemas = false;

            return;
        }

        const legacyWorkspaces = [];
        const rootContainerUrl = user.storageUrls[0];
        const rootContainer = await fetchSolidDocument(rootContainerUrl, { fetch: Solid.fetch });
        const containerUrls = rootContainer
            .statements(rootContainerUrl, 'ldp:contains')
            .map(({ object }) => object.value)
            .filter((url) => url.endsWith('/'));

        for (const containerUrl of containerUrls) {
            const container = await fetchSolidDocument(containerUrl, { fetch: Solid.fetch });

            if (!container.statement(containerUrl, 'rdf:type', 'http://purl.org/vocab/lifecycle/schema#TaskGroup')) {
                continue;
            }

            const workspace = await Workspace.withEngine(Solid.requireAuthenticator().engine).find(containerUrl);

            workspace && legacyWorkspaces.push(workspace);
        }

        this.usingLegacySchemas = legacyWorkspaces.length > 0;

        if (!this.usingLegacySchemas) {
            return;
        }

        const typeIndex = await Solid.findOrCreatePrivateTypeIndex();

        await this.bootLegacySchemas();

        for (const workspace of legacyWorkspaces) {
            await workspace.withEngine(Solid.requireAuthenticator().engine).register(typeIndex, Task);
        }
    }

    protected onMigrationCompleted(): void {
        this.usingLegacySchemas = false;
    }

    protected onTaskDeleted(task: Task): void {
        if (!this.task || !this.task.is(task)) {
            return;
        }

        this.select(null);
    }

}

export default facade(WorkspacesService);
