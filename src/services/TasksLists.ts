import { Events } from '@aerogel/core';
import { facade } from '@noeldemartin/utils';
import { watchEffect } from 'vue';

import Task from '@/models/Task';
import Workspaces from '@/services/Workspaces';

import Service from './TasksLists.state';

export class TasksListsService extends Service {

    protected async boot(): Promise<void> {
        await Workspaces.booted;

        watchEffect(() => (this.lastVisitedListUrl = this.current?.url ?? this.lastVisitedListUrl));

        Events.on('auth:logout', () => (this.lastVisitedListUrl = null));
        Task.on('deleted', (deletedTask) => {
            if (!this.current?.tasks) {
                return;
            }

            this.current.tasks = this.current.tasks.filter((relatedTask) => !relatedTask.is(deletedTask));
        });
    }

}

export default facade(TasksListsService);
