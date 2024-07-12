import { arraySorted, facade } from '@noeldemartin/utils';
import { Cloud } from '@aerogel/plugin-offline-first';
import { Events } from '@aerogel/core';
import { trackModelCollection } from '@aerogel/plugin-soukai';
import { watchEffect } from 'vue';

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
        await Cloud.register(Workspace);
        await trackModelCollection(Workspace, {
            service: this,
            property: 'all',
            transform: (workspaces) => arraySorted(workspaces, 'name'),
        });

        watchEffect(() => (this.lastVisitedWorkspaceUrl = this.current?.url ?? this.lastVisitedWorkspaceUrl));

        Events.on('auth:logout', () => (this.lastVisitedWorkspaceUrl = null));
        Task.on('deleted', (deletedTask) => {
            if (!this.task || !this.task.is(deletedTask)) {
                return;
            }

            this.select(null);
        });
    }

}

export default facade(WorkspacesService);
