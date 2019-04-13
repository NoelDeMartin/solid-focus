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
                ...(await Workspace.from(storageUrl).all<Workspace>())
                    .map(workspace => {
                        // TODO treat contained tasks as the inbox
                        const inbox = new List({ url: workspace.url, name: 'Inbox' });

                        inbox.setRelation('tasks', []);
                        inbox.setWorkspace(workspace);
                        workspace.addList(inbox);
                        workspace.setActiveList(inbox);

                        return workspace;
                    }),
            );
        }

        return workspaces;
    }

    public async unloadWorkspaces(): Promise<void> {
        // nothing to do here
    }

    public async loadWorkspace(workspace: Workspace): Promise<void> {
        // TODO once workspace <-> lists relation is implemented,
        // check if relation is loaded or is loading instead
        if (!workspace.loaded && !workspace.loading) {
            workspace.loading = true;

            const lists = await List.from(workspace.id).all<List>();

            for (const list of lists) {
                list.setWorkspace(workspace);
                workspace.lists.push(list);
            }

            workspace.loaded = true;
            workspace.loading = false;
        }
    }

    public async createWorkspace(storage: string, name: string): Promise<Workspace> {
        const workspace = new Workspace({ name });

        // TODO treat contained tasks as the inbox
        const inbox = new List({ name: 'Inbox' });

        workspace.save(storage);

        inbox.setRelation('tasks', []);
        inbox.setAttribute('url', workspace.url);
        inbox.setWorkspace(workspace);
        workspace.addList(inbox);
        workspace.setActiveList(inbox);

        return workspace;
    }

    public async loadList(list: List): Promise<void> {
        await list.loadRelation('tasks');
    }

    public async createList(workspace: Workspace, name: string): Promise<List> {
        const list = new List({ name });

        list.save(workspace.id);
        list.setRelation('tasks', []);

        workspace.addList(list);

        return list;
    }

    public async createTask(list: List, name: string): Promise<Task> {
        const task = new Task({ name });

        task.save(list.id || list.workspace.id);

        if (list.isRelationLoaded('tasks')) {
            list.tasks = [...list.tasks, task];
        } else {
            list.loadRelation('tasks');
        }

        return task;
    }

    public async toggleTask(task: Task): Promise<void> {
        task.toggle();
        task.save();
    }

}
