import { facade } from '@noeldemartin/utils';
import { trackModelCollection } from '@aerogel/plugin-soukai';
import { watchEffect } from 'vue';

import Workspace from '@/models/Workspace';
import TasksLists from '@/services/TasksLists';
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
        await trackModelCollection(Workspace, {
            service: this,
            property: 'all',
        });

        watchEffect(() => (this.lastVisitedWorkspaceUrl = this.current?.url ?? this.lastVisitedWorkspaceUrl));
    }

}

export default facade(new WorkspacesService());
