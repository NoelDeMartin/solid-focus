import SolidAuthClient from 'solid-auth-client';
import $rdf from 'rdflib';

import BaseWorkspaces, { Workspace } from '@/services/Workspaces';
import { SolidUser } from '@/services/solid/Auth';

import Str from '@/utils/Str';

const LDP = $rdf.Namespace('http://www.w3.org/ns/ldp#');
const FOAF = $rdf.Namespace('http://cmlns.com/foaf/0.1/');
const RDFS = $rdf.Namespace('http://www.w3.org/1999/02/22-rdf-syntax-ns#');

const WORKSPACE_TYPE = 'http://vocab.org/lifecycle/schema#TaskGroup';

interface Container {
    name: string;
    types: string[];
}

export default class Workspaces extends BaseWorkspaces {

    public async create(name: string): Promise<void> {
        const user = this.app.$auth.withUser(user => user) as SolidUser;

        if (user.storages.length === 0) {
            throw new Error('User does not have any storage configured');
        }

        const container = await this.createContainer(
            user.storages[0],
            name,
            [WORKSPACE_TYPE]
        );

        this.addWorkspace(this.createWorkspaceFromContainer(container));
    }

    protected async loadUserWorkspaces(user: SolidUser): Promise<void> {
        const containers = await this.getContainers(
            user.podUrl,
            [WORKSPACE_TYPE]
        );

        if (containers.length > 0) {
            this.addWorkspace(
                this.createWorkspaceFromContainer(containers.pop() as Container),
                true
            );

            for (const container of containers) {
                this.addWorkspace(this.createWorkspaceFromContainer(container), false);
            }
        }
    }

    private async createContainer(
        url: string,
        name: string,
        types: string[]
    ): Promise<Container> {
        const store = $rdf.graph();
        const fetcher = new $rdf.Fetcher(store, {});

        await (fetcher as any).webOperation('POST', url, {
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

        return { name, types };
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
            name: nameTerm ? nameTerm.value: 'Unknown',
            types: typeTerms.map(term => term.value),
        };
    }

    private createWorkspaceFromContainer(container: Container): Workspace {
        return {
            name: container.name,
        };
    }

}
