import { Cloud } from '@aerogel/plugin-offline-first';
import { arraySorted, facade } from '@noeldemartin/utils';
import { Solid } from '@aerogel/plugin-solid';
import { trackModelCollection } from '@aerogel/plugin-soukai';
import { watchEffect } from 'vue';

import Task from '@/models/Task';
import TasksLists from '@/services/TasksLists';
import Workspace from '@/models/Workspace';
import type TasksList from '@/models/TasksList';

import Service from './Workspaces.state';

export class WorkspacesService extends Service {

    public async open(): Promise<void> {
        const workspace = this.all.find((model) => model.url === this.lastVisitedWorkspaceUrl) ?? this.all[0];
        const lists = await workspace?.loadRelationIfUnloaded<TasksList[]>('lists');
        const list = lists?.find((model) => model.url === TasksLists.lastVisitedListUrl);

        await workspace?.open(list);
    }

    protected async boot(): Promise<void> {
        await Cloud.booted;
        await Cloud.registerHandler({
            modelClass: Workspace,
            registerFor: Task,
            getLocalModels: () => this.all,
        });

        watchEffect(() => (this.lastVisitedWorkspaceUrl = this.current?.url ?? this.lastVisitedWorkspaceUrl));
        Cloud.whenReady(() => (Workspace.collection = Solid.requireUser().storageUrls[0]));

        await trackModelCollection(Workspace, {
            service: this,
            property: 'all',
            transform: (workspaces) => arraySorted(workspaces, 'name'),
        });
    }

}

export default facade(WorkspacesService);
