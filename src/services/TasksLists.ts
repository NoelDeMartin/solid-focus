import { Events } from '@aerogel/core';
import { facade } from '@noeldemartin/utils';
import { watchEffect } from 'vue';

import Task from '@/models/Task';
import Workspaces from '@/services/Workspaces';

import Service from './TasksLists.state';

export class TasksListsService extends Service {

    protected async boot(): Promise<void> {
        await Workspaces.booted;

        Task.on('deleted', (task) => this.onTaskDeleted(task));
        Events.on('auth:after-logout', () => (this.lastVisitedListUrl = null));
        watchEffect(() => (this.lastVisitedListUrl = this.current?.url ?? this.lastVisitedListUrl));
    }

    protected onTaskDeleted(task: Task): void {
        if (!this.current?.tasks) {
            return;
        }

        this.current.tasks = this.current.tasks.filter((relatedTask) => !relatedTask.is(task));
    }

}

export default facade(TasksListsService);
