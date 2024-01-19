import { facade } from '@noeldemartin/utils';
import { watchEffect } from 'vue';

import Workspaces from '@/services/Workspaces';
import type TasksList from '@/models/TasksList';

import Service from './TasksLists.state';

export class TasksListsService extends Service {

    public async open(list: TasksList): Promise<void> {
        await list.loadRelationIfUnloaded('tasks');

        this.currentTasksListId = list.id;
    }

    protected async boot(): Promise<void> {
        await Workspaces.booted;

        this.current && (await this.open(this.current));

        watchEffect(async () => {
            const lists = Workspaces.current?.lists ?? [];
            const current = lists.find((list) => list.id === this.currentTasksListId) ?? lists[0] ?? null;

            if (!current) {
                this.currentTasksListId = null;

                return;
            }

            await this.open(current);
        });
    }

}

export default facade(new TasksListsService());
