import Backend from '@/services/backends/Backend';

import List from '@/models/soukai/List';
import Task from '@/models/soukai/Task';
import Workspace, { WorkspaceJson } from '@/models/Workspace';

import Storage from '@/utils/Storage';
import UUIDGenerator from '@/utils/UUIDGenerator';

export default class OfflineBackend extends Backend {

    private workspaces: Workspace[] = [];

    public async loadWorkspaces(): Promise<Workspace[]> {
        const workspaceJsons: WorkspaceJson[] = Storage.get('workspaces', []);

        this.workspaces = workspaceJsons.map(workspaceJson => {
            const workspace = Workspace.fromJson(workspaceJson);

            workspace.loaded = true;
            workspace.lists.forEach(list => {
                list.setWorkspace(workspace);
                list.loaded = true;
            });

            return workspace;
        });

        return this.workspaces.slice(0);
    }

    public async unloadWorkspaces(): Promise<void> {
        Storage.remove('workspaces');
    }

    public async loadWorkspace(workspace: Workspace): Promise<void> {
        // Offline workspaces are always fully loaded
    }

    public async createWorkspace(name: string): Promise<Workspace> {
        const workspaceId = UUIDGenerator.generate();
        const inbox = new List({ url: workspaceId, name: 'Inbox' });
        const workspace = new Workspace(workspaceId, name, [inbox], inbox);

        inbox.setWorkspace(workspace);
        inbox.loaded = true;
        workspace.loaded = true;

        this.workspaces.push(workspace);

        this.workspacesUpdated();

        return workspace;
    }

    public async loadList(list: List): Promise<void> {
        // Offline lists are always fully loaded
    }

    public async createList(workspace: Workspace, name: string): Promise<List> {
        const list = new List({ url: UUIDGenerator.generate(), name });

        list.setWorkspace(workspace);
        workspace.addList(list);
        list.loaded = true;

        this.workspacesUpdated();

        return list;
    }

    public async createTask(list: List, name: string): Promise<Task> {
        const task = new Task({ url: UUIDGenerator.generate(), name });

        list.add(task);

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
