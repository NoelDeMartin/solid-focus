import Vue from 'vue';

import { start } from './bootstrap';

import List from '@/models/soukai/List';
import Task from '@/models/soukai/Task';
import Workspace from '@/models/soukai/Workspace';

import EventBus from '@/utils/EventBus';

window.Runtime = {
    instance: Vue.instance,
    start,

    eventBus: EventBus,

    require(name: string): any {
        const libs: any = {
            'solid-auth-client': require('solid-auth-client'),
            'soukai': require('soukai'),
        };

        return libs[name];
    },

    async createWorkspace(name: string, storage: string = ''): Promise<Workspace> {
        const workspace = new Workspace({ name });

        await workspace.save(storage);

        workspace.setRelationModels('lists', []);

        this.instance.$workspaces.add(workspace);

        return workspace;
    },

    async createList(workspace: Workspace, name: string): Promise<List> {
        const list = new List({ name });

        await list.save(workspace.url);
        await workspace.update({
            resourceUrls: [...workspace.resourceUrls, list.url],
        });

        list.setRelationModels('tasks', []);
        list.setRelationModels('workspace', workspace);

        workspace.setRelationModels('lists', [...workspace.lists!, list]);
        workspace.setActiveList(list);

        return list;
    },

    async createTask(list: List, name: string): Promise<Task> {
        const task = await list.createTask({ name });

        return task;
    },
};
