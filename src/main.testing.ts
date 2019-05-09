import { start, instance } from './bootstrap';

import List from '@/models/soukai/List';
import Task from '@/models/soukai/Task';
import Workspace from '@/models/soukai/Workspace';

window.Runtime = {
    instance,
    start,

    require(name: string): any {
        const libs: any = {
            'solid-auth-client': require('solid-auth-client'),
        };

        return libs[name];
    },

    async createWorkspace(name: string, storage: string = ''): Promise<Workspace> {
        const workspace = new Workspace({ name });

        workspace.save(storage);
        workspace.setRelation('lists', []);

        this.instance.$workspaces.add(workspace);

        return workspace;
    },

    async createList(workspace: Workspace, name: string): Promise<List> {
        const list = new List({ name });

        list.save(workspace.url);
        list.setRelation('tasks', []);
        list.setRelation('workspace', workspace);

        workspace.setRelation('lists', [...workspace.lists!, list]);
        workspace.setActiveList(list);

        return list;
    },

    async createTask(list: List, name: string): Promise<Task> {
        const task = new Task({ name });

        task.save(list.url);

        list.setRelation('tasks', [...list.tasks || [], task]);

        return task;
    },
};
