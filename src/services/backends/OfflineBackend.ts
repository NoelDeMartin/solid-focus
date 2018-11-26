import Backend from '@/services/backends/Backend';

import List from '@/models/List';
import Task from '@/models/Task';
import Workspace from '@/models/Workspace';

import Storage from '@/utils/Storage';
import UUIDGenerator from '@/utils/UUIDGenerator';

export default class OfflineBackend extends Backend {

    public async destroy(): Promise<void> {
        await super.destroy();

        this.app.$workspaces.update([]);
    }

    public async createWorkspace(name: string): Promise<Workspace> {
        const inbox = new List(UUIDGenerator.generate(), 'Inbox');
        const workspace = new Workspace(UUIDGenerator.generate(), name, [inbox], inbox);

        inbox.setWorkspace(workspace);

        this.app.$workspaces.addWorkspace(workspace);

        Storage.set('workspaces', this.app.$workspaces.all);

        return workspace;
    }

    public async createList(workspace: Workspace, name: string): Promise<List> {
        const list = new List(UUIDGenerator.generate(), name);

        list.setWorkspace(workspace);

        workspace.addList(list);

        Storage.set('workspaces', this.app.$workspaces.all);

        return list;
    }

    public async createTask(list: List, name: string): Promise<Task> {
        const task = new Task(UUIDGenerator.generate(), name);

        list.add(task);

        Storage.set('workspaces', this.app.$workspaces.all);

        return task;
    }

    protected async loadUserWorkspaces(): Promise<void> {
        const workspaces = Storage.get('workspaces');

        if (workspaces !== null) {
            this.app.$workspaces.update(workspaces);
        }
    }

}
