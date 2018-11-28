import Backend from '@/services/backends/Backend';

import List from '@/models/List';
import Task from '@/models/Task';
import Workspace from '@/models/Workspace';
import SolidUser from '@/models/users/SolidUser';

import Solid, { Resource } from '@/utils/Solid';

const TASK = 'http://vocab.org/lifecycle/schema#Task';
const TASK_GROUP = 'http://vocab.org/lifecycle/schema#TaskGroup';

export default class SolidBackend extends Backend<SolidUser> {

    public async loadUserWorkspaces(user: SolidUser): Promise<Workspace[]> {
        const containers = await Solid.getContainers(user.podUrl, [TASK_GROUP]);

        return Promise.all(
            containers.map(
                container => this.createWorkspaceFromResource(container)
            )
        );
    }

    public async createWorkspace(storage: string, name: string): Promise<Workspace> {
        const resource = await Solid.createContainer(storage, name, [TASK_GROUP]);

        return await this.createWorkspaceFromResource(resource);
    }

    public async createList(workspace: Workspace, name: string): Promise<List> {
        const container = await Solid.createContainer(workspace.id, name, [TASK_GROUP]);
        const list = await this.createListFromResource(container);

        list.setWorkspace(workspace);

        workspace.addList(list);

        return list;
    }

    public async createTask(list: List, name: string): Promise<Task> {
        const parentUrl = list.id || list.workspace.id;
        const resource = await Solid.createResource(parentUrl, name, [TASK]);
        const task = this.createTaskFromResource(resource);

        list.add(task);

        return task;
    }

    private async createWorkspaceFromResource(resource: Resource): Promise<Workspace> {
        const inbox = new List(null, 'Inbox', []);
        const resources = await Solid.getResources(resource.url, [TASK]);

        for (const resource of resources) {
            inbox.add(this.createTaskFromResource(resource));
        }

        const lists = [inbox];

        const childContainers = await Solid.getContainers(resource.url, [TASK_GROUP]);

        for (const childContainer of childContainers) {
            if (childContainer.url !== resource.url) {
                lists.push(await this.createListFromResource(childContainer));
            }
        }

        const workspace = new Workspace(resource.url, resource.name, lists, inbox);

        for (const list of lists) {
            list.setWorkspace(workspace);
        }

        return workspace;
    }

    private async createListFromResource(resource: Resource): Promise<List> {
        const list = new List(resource.url, resource.name, []);

        const resources = await Solid.getResources(resource.url, [TASK]);

        for (const childResource of resources) {
            list.add(this.createTaskFromResource(childResource));
        }

        return list;
    }

    private createTaskFromResource(resource: Resource): Task {
        return new Task(resource.url, resource.name);
    }

}
