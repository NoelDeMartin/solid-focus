import { facade } from '@noeldemartin/utils';
import { Router } from '@aerogel/plugin-routing';
import { watchEffect } from 'vue';

import Workspaces from '@/services/Workspaces';
import type TasksList from '@/models/TasksList';

import Service from './TasksLists.state';

export class TasksListsService extends Service {

    public async open(list?: TasksList): Promise<boolean> {
        list ??= Workspaces.current?.lists?.[0];

        if (!list) {
            return false;
        }

        await Router.push({
            name: 'workspace',
            params: {
                workspace: Workspaces.current?.slug,
                list: list !== Workspaces.current?.lists?.[0] ? list.slug : '',
            },
        });

        return true;
    }

    protected async boot(): Promise<void> {
        await Workspaces.booted;

        watchEffect(() => (this.lastVisitedListId = this.current?.id ?? this.lastVisitedListId));
    }

}

export default facade(new TasksListsService());
