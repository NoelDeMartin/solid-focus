import SolidAuthClient from 'solid-auth-client';
import $rdf from 'rdflib';

import BaseWorkspaces from '@/services/Workspaces';

import Workspace from '@/models/solid/Workspace';
import User from '@/models/solid/User';
import List from '@/models/solid/List';
import Task from '@/models/Task';

import Str from '@/utils/Str';

const LDP = $rdf.Namespace('http://www.w3.org/ns/ldp#');
const FOAF = $rdf.Namespace('http://cmlns.com/foaf/0.1/');
const RDFS = $rdf.Namespace('http://www.w3.org/1999/02/22-rdf-syntax-ns#');

const TASK = 'http://vocab.org/lifecycle/schema#Task';
const TASK_GROUP = 'http://vocab.org/lifecycle/schema#TaskGroup';

interface Container extends Resource {
    url: string;
}

interface Resource {
    name: string;
    types: string[];
}

export default class Workspaces extends BaseWorkspaces<Workspace, User> {

    public async createWorkspace(storage: string, name: string): Promise<Workspace> {
        const container = await this.createContainer(
            storage,
            name,
            [TASK_GROUP]
        );

        const workspace = await this.createWorkspaceFromContainer(container);

        this.addWorkspace(workspace);

        return workspace;
    }

    public async createList(workspace: Workspace, name: string): Promise<List> {
        const container = await this.createContainer(
            workspace.url,
            name,
            [TASK_GROUP],
        );

        const list = await this.createListFromContainer(container);

        list.setWorkspace(workspace);

        workspace.addList(list);

        return list;
    }

    public async createTask(list: List, name: string): Promise<Task> {
        const parentUrl = list.url || list.workspace.url;

        const resource = await this.createResource(parentUrl, name, [TASK]);

        const task = this.createTaskFromResource(resource);

        list.add(task);

        return task;
    }

    protected async loadUserWorkspaces(user: User): Promise<void> {
        const containers = await this.getContainers(
            user.podUrl,
            [TASK_GROUP]
        );

        if (containers.length > 0) {
            this.addWorkspace(
                await this.createWorkspaceFromContainer(containers.pop() as Container),
                true
            );

            for (const container of containers) {
                this.addWorkspace(await this.createWorkspaceFromContainer(container), false);
            }
        }
    }

    private async createContainer(
        url: string,
        name: string,
        types: string[],
    ): Promise<Container> {
        const store = $rdf.graph();
        const fetcher = new $rdf.Fetcher(store, {});

        const result: Response = await (fetcher as any).webOperation('POST', url, {
            contentType: 'text/turtle',
            headers: {
                'content-type': 'text/turtle',
                'link': LDP('BasicContainer') + '; rel="type"',
                'slug': Str.slug(name),
            },
            body:
                [
                    ...types.map(type => `<> a <${type}> .`),
                    `<> ${FOAF('name')} "${name}" .`,
                ].join("\n"),
        });

        return {
            url: url + result.headers.get('Location'),
            name,
            types,
        };
    }

    private async createResource(url: string, name: string, types: string[]): Promise<Resource> {
        const store = $rdf.graph();
        const fetcher = new $rdf.Fetcher(store, {});

        await (fetcher as any).webOperation('POST', url, {
            contentType: 'text/turtle',
            headers: {
                'content-type': 'text/turtle',
            },
            body:
                [
                    ...types.map(type => `<> a <${type}> .`),
                    `<> ${FOAF('name')} "${name}" .`,
                ].join("\n"),
        });

        return {
            name,
            types,
        };
    }

    private async getContainers(url: string, types: string[]): Promise<Container[]> {
        // TODO use SparQL instead to execute only one request

        const data = await SolidAuthClient.fetch(url).then(res => res.text());

        const store = $rdf.graph();

        $rdf.parse(data, store, url, 'text/turtle', null as any);

        const containerResources = store.each(
            null as any,
            RDFS('type'),
            LDP('BasicContainer'),
            null as any
        );

        const containers: Container[] = [];

        outerLoop:
        for (const resource of containerResources) {

            const containerUrl = resource.value;
            const containerData = await SolidAuthClient.fetch(containerUrl).then(res => res.text());

            const container = this.parseContainer(containerUrl, containerData);

            for (const type of types) {
                if (container.types.indexOf(type) === -1) {
                    continue outerLoop;
                }
            }

            containers.push(container);
        }

        return containers;
    }

    private async getResources(url: string, types: string[]): Promise<Resource[]> {
        // TODO use SparQL instead to execute only one request

        const data = await SolidAuthClient.fetch(url).then(res => res.text());

        const store = $rdf.graph();

        $rdf.parse(data, store, url, 'text/turtle', null as any);

        const containerResources = store.each(
            null as any,
            RDFS('type'),
            LDP('Resource'),
            null as any
        );

        const resources: Resource[] = [];

        outerLoop:
        for (const containerResource of containerResources) {

            const resourceUrl = containerResource.value;
            const resourceData = await SolidAuthClient.fetch(resourceUrl).then(res => res.text());

            const resource = this.parseResource(resourceUrl, resourceData);

            for (const type of types) {
                if (resource.types.indexOf(type) === -1) {
                    continue outerLoop;
                }
            }

            resources.push(resource);
        }

        return resources;
    }

    private parseContainer(base: string, data: string): Container {
        const store = $rdf.graph();

        $rdf.parse(data, store, base, 'text/turtle', null as any);

        const typeTerms = store.each(
            $rdf.sym(base),
            RDFS('type'),
            null as any,
            null as any
        );

        const nameTerm = store.any(
            $rdf.sym(base),
            FOAF('name'),
            null as any,
            null as any
        );

        return {
            url: base,
            name: (nameTerm || {}).value || 'Unknown',
            types: typeTerms.map(term => term.value),
        };
    }

    private parseResource(base: string, data: string): Resource {
        const store = $rdf.graph();

        $rdf.parse(data, store, base, 'text/turtle', null as any);

        const typeTerms = store.each(
            $rdf.sym(base),
            RDFS('type'),
            null as any,
            null as any
        );

        const nameTerm = store.any(
            $rdf.sym(base),
            FOAF('name'),
            null as any,
            null as any
        );

        return {
            name: (nameTerm || {}).value || 'Unknown',
            types: typeTerms.map(term => term.value),
        };
    }

    private async createWorkspaceFromContainer(container: Container): Promise<Workspace> {
        const inbox = new List('Inbox', [], null);
        const resources = await this.getResources(container.url, [TASK]);

        for (const resource of resources) {
            inbox.add(this.createTaskFromResource(resource));
        }

        const lists = [inbox];

        const childContainers = await this.getContainers(container.url, [TASK_GROUP]);

        for (const childContainer of childContainers) {
            if (childContainer.url !== container.url) {
                lists.push(await this.createListFromContainer(childContainer));
            }
        }

        const workspace = new Workspace(container.name, lists, inbox, container.url);

        for (const list of lists) {
            list.setWorkspace(workspace);
        }

        return workspace;
    }

    private async createListFromContainer(container: Container): Promise<List> {
        const list = new List(container.name, [], container.url);

        const resources = await this.getResources(container.url, [TASK]);

        for (const resource of resources) {
            list.add(this.createTaskFromResource(resource));
        }

        return list;
    }

    private createTaskFromResource(resource: Resource): Task {
        return new Task(resource.name);
    }

}
