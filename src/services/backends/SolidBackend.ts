import Backend from '@/services/backends/Backend';

import List from '@/models/List';
import SolidUser from '@/models/users/SolidUser';
import Task from '@/models/soukai/Task';
import Workspace from '@/models/Workspace';

import Solid, { Resource } from '@/utils/Solid';
import Str from '@/utils/Str';

const TASK_GROUP = 'http://purl.org/vocab/lifecycle/schema#TaskGroup';

export default class SolidBackend extends Backend<SolidUser> {

    public async loadWorkspaces(user: SolidUser): Promise<Workspace[]> {
        const containers = [];
        for (const storageUrl of user.storages) {
            containers.push(... await Solid.getContainers(storageUrl, [TASK_GROUP]));
        }

        return await Promise.all(
            containers.map(
                container => this.createWorkspaceFromResource(container)
            )
        );
    }

    public async unloadWorkspaces(): Promise<void> {
        // nothing to do here
    }

    public async loadWorkspace(workspace: Workspace): Promise<void> {
        if (!workspace.loaded && !workspace.loading) {
            workspace.loading = true;

            const childContainers = await Solid.getContainers(workspace.id, [TASK_GROUP]);

            for (const childContainer of childContainers) {
                if (childContainer.url !== workspace.id) {
                    const list = await this.createListFromResource(childContainer);

                    list.setWorkspace(workspace);
                    workspace.lists.push(list);
                }
            }

            workspace.loaded = true;
            workspace.loading = false;
        }
    }

    public async createWorkspace(storage: string, name: string): Promise<Workspace> {
        const resource = await Solid.createContainer(
            storage,
            Str.slug(name),
            name,
            [TASK_GROUP]
        );

        return await this.createWorkspaceFromResource(resource);
    }

    public async loadList(list: List): Promise<void> {
        if (!list.loaded && !list.loading) {
            list.loading = true;

            const containerUrl = list.id || list.workspace.id;

            const tasks = await Task.from(containerUrl).all<Task>();

            for (const task of tasks) {
                list.add(task);
            }

            list.loaded = true;
            list.loading = false;
        }
    }

    public async createList(workspace: Workspace, name: string): Promise<List> {
        const container = await Solid.createContainer(
            workspace.id,
            Str.slug(name),
            name,
            [TASK_GROUP]
        );
        const list = await this.createListFromResource(container);

        list.setWorkspace(workspace);

        workspace.addList(list);

        return list;
    }

    public async createTask(list: List, name: string): Promise<Task> {
        const task = new Task({
            name,
        });

        task.save(list.id || list.workspace.id);

        list.add(task);

        return task;
    }

    public async toggleTask(task: Task): Promise<void> {
        task.toggle();
        task.save();
    }

    private async createWorkspaceFromResource(resource: Resource): Promise<Workspace> {
        const inbox = new List(null, 'Inbox', []);
        const workspace = new Workspace(resource.url, resource.name, [inbox], inbox);

        inbox.setWorkspace(workspace);

        return workspace;
    }

    private async createListFromResource(resource: Resource): Promise<List> {
        return new List(resource.url, resource.name, []);
    }

}
