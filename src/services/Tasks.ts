import { facade } from '@noeldemartin/utils';
import { watchEffect } from 'vue';

import TasksLists from '@/services/TasksLists';
import Task from '@/models/Task';

import Service from './Tasks.state';

export class TasksService extends Service {

    public select(task: Task | null): void {
        this.current = task;
    }

    protected async boot(): Promise<void> {
        await TasksLists.booted;

        Task.on('deleted', (task) => this.onTaskDeleted(task));

        watchEffect(() => {
            if (!this.current) {
                return;
            }

            this.current = TasksLists.current?.tasks?.find((task) => this.current && task.is(this.current)) ?? null;
        });
    }

    protected onTaskDeleted(task: Task): void {
        if (!this.current || !this.current.is(task)) {
            return;
        }

        this.select(null);
    }

}

export default facade(TasksService);
