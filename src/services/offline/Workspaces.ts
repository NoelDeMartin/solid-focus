import BaseWorkspaces from '@/services/Workspaces';

import Workspace from '@/models/Workspace';
import List from '@/models/List';
import User from '@/models/User';
import Task from '@/models/Task';

import Storage from '@/utils/Storage';

export default class Workspaces extends BaseWorkspaces {

    public async createWorkspace(name: string): Promise<Workspace> {
        const inbox = new List('Inbox');
        const workspace = new Workspace(name, [inbox], inbox);

        inbox.setWorkspace(workspace);

        this.addWorkspace(workspace);

        Storage.set('workspaces', this.all);

        return workspace;
    }

    public async createList(workspace: Workspace, name: string): Promise<List> {
        const list = new List(name);

        list.setWorkspace(workspace);

        workspace.addList(list);

        Storage.set('workspaces', this.all);

        return list;
    }

    public async createTask(list: List, name: string): Promise<Task> {
        const task = new Task(name);

        list.add(task);

        Storage.set('workspaces', this.all);

        return task;
    }

    protected async init(): Promise<void> {
        await super.init();

        const workspaces = Storage.get('workspaces');

        if (workspaces !== null) {
            this.initWorkspaces(workspaces);
        }
    }

    protected async loadUserWorkspaces(user: User): Promise<void> {
        // nothing to do here
    }

}
