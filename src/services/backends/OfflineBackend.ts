import Backend from '@/services/backends/Backend';

import List from '@/models/soukai/List';
import Task from '@/models/soukai/Task';
import Workspace, { WorkspaceJson } from '@/models/soukai/Workspace';

import Storage from '@/utils/Storage';
import UUIDGenerator from '@/utils/UUIDGenerator';

export default class OfflineBackend extends Backend {

    private workspaces: Workspace[] = [];

    public async loadWorkspaces(): Promise<Workspace[]> {
        const workspaceJsons: WorkspaceJson[] = Storage.get('workspaces', []);

        this.workspaces = workspaceJsons.map(Workspace.fromJson);

        return this.workspaces.slice(0);
    }

    public async unloadWorkspaces(): Promise<void> {
        Storage.remove('workspaces');
    }

    public async createWorkspace(name: string): Promise<Workspace> {
        const workspace = new Workspace({ url: UUIDGenerator.generate(), name }, true);

        workspace.setRelation('lists', []);

        this.workspaces.push(workspace);

        this.workspacesUpdated();

        return workspace;
    }

    public async createList(workspace: Workspace, name: string): Promise<List> {
        const list = new List({ url: UUIDGenerator.generate(), name });

        list.setRelation('tasks', []);
        list.setRelation('workspace', workspace);

        workspace.setRelation('lists', [...workspace.lists || [], list]);

        this.workspacesUpdated();

        return list;
    }

    public async createTask(list: List, name: string): Promise<Task> {
        const task = new Task({ url: UUIDGenerator.generate(), name });

        list.setRelation('tasks', [...list.tasks || [], task]);

        this.workspacesUpdated();

        return task;
    }

    public async toggleTask(task: Task): Promise<void> {
        task.toggle();

        this.workspacesUpdated();
    }

    protected workspacesUpdated(): void {
        Storage.set('workspaces', this.workspaces.map(workspace => workspace.toJson()));
    }

}
