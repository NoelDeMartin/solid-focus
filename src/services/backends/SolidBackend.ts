import Backend from '@/services/backends/Backend';

import List from '@/models/soukai/List';
import SolidUser from '@/models/users/SolidUser';
import Task from '@/models/soukai/Task';
import Workspace from '@/models/soukai/Workspace';

export default class SolidBackend extends Backend<SolidUser> {

    public async loadWorkspaces(user: SolidUser): Promise<Workspace[]> {
        const workspaces: Workspace[] = [];

        for (const storageUrl of user.storages) {
            workspaces.push(
                ...(await Workspace.from(storageUrl).all<Workspace>()),
            );
        }

        return workspaces;
    }

    public async unloadWorkspaces(): Promise<void> {
        // nothing to do here
    }

    public async createWorkspace(storage: string, name: string): Promise<Workspace> {
        const workspace = new Workspace({ name });

        workspace.save(storage);

        workspace.setRelation('lists', []);

        return workspace;
    }

    public async createList(workspace: Workspace, name: string): Promise<List> {
        const list = new List({ name });

        list.save(workspace.id);
        list.setRelation('tasks', []);
        list.setRelation('workspace', workspace);

        workspace.setRelation('lists', [...workspace.lists!, list]);

        return list;
    }

    public async createTask(list: List, name: string): Promise<Task> {
        const task = new Task({ name });

        task.save(list.id);

        list.setRelation('tasks', [...list.tasks || [], task]);

        return task;
    }

    public async toggleTask(task: Task): Promise<void> {
        task.toggle();
        task.save();
    }

}
