import { facade } from '@noeldemartin/utils';
import { watchEffect } from 'vue';

import Workspaces from '@/services/Workspaces';

import Service from './TasksLists.state';

export class TasksListsService extends Service {

    protected async boot(): Promise<void> {
        await Workspaces.booted;

        watchEffect(() => (this.lastVisitedListUrl = this.current?.url ?? this.lastVisitedListUrl));
    }

}

export default facade(TasksListsService);
