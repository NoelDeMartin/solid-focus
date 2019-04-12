import Backend from '@/services/backends/Backend';

import List from '@/models/soukai/List';
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
        const resource = await Solid.createContainer(
            storage,
            Str.slug(name),
            name,
            [TASK_GROUP]
        );

        return await this.createWorkspaceFromResource(resource);
    }

    public async loadList(list: List): Promise<void> {
        await list.loadRelation('tasks');
    }

    public async createList(workspace: Workspace, name: string): Promise<List> {
        const list = new List({ name });

        list.save(workspace.id);

        workspace.addList(list as any);

        return list as any;
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

    private async createWorkspaceFromResource(resource: Resource): Promise<Workspace> {
        // TODO make Workspaces a lifecycle:TaskGroup as well and treat
        // contained tasks as the inbox
        const inbox = new List ({ name: 'Inbox' });
        const workspace = new Workspace(resource.url, resource.name, [inbox], inbox);

        inbox.setAttribute('url', workspace.id);
        inbox.setWorkspace(workspace);

        return workspace;
    }

}
