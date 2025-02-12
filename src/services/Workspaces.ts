import { arraySorted, facade } from '@noeldemartin/utils';
import { Cloud } from '@aerogel/plugin-offline-first';
import { Events } from '@aerogel/core';
import { fetchSolidDocument } from '@noeldemartin/solid-utils';
import { Solid } from '@aerogel/plugin-solid';
import { trackModels } from '@aerogel/plugin-soukai';
import { watchEffect } from 'vue';

import LegacyTaskSchema from '@/models/legacy/Task.schema';
import Task from '@/models/Task';
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

    protected async boot(): Promise<void> {
        await Cloud.booted;
        await Cloud.register(Workspace, { path: '/tasks/' });
        await trackModels(Workspace, {
            service: this,
            property: 'all',
            transform: (workspaces) => arraySorted(workspaces, 'name'),
        });

        watchEffect(() => (this.lastVisitedWorkspaceUrl = this.current?.url ?? this.lastVisitedWorkspaceUrl));

        Events.on('auth:after-logout', () => (this.lastVisitedWorkspaceUrl = null));
        Events.on('cloud:sync-started', () => this.prepareLegacySchemas());
        Task.on('deleted', (deletedTask) => {
            if (!this.task || !this.task.is(deletedTask)) {
                return;
            }

            this.select(null);
        });
    }

    protected async prepareLegacySchemas(): Promise<void> {
        const user = Solid.user;

        if (!user?.usedLegacyApp) {
            return;
        }

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
            const typeIndex = await Solid.findOrCreatePrivateTypeIndex();

            await Task.updateSchema(LegacyTaskSchema);
            await workspace?.withEngine(Solid.requireAuthenticator().engine).register(typeIndex, Task);
        }
    }

}

export default facade(WorkspacesService);
