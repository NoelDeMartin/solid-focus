import SolidAuthClient, { Session } from 'solid-auth-client';
import $rdf, { IndexedFormula, NamedNode } from 'rdflib';

import Str from '@/utils/Str';

type Graph = IndexedFormula;

const LDP = $rdf.Namespace('http://www.w3.org/ns/ldp#');
const FOAF = $rdf.Namespace('http://cmlns.com/foaf/0.1/');
const RDFS = $rdf.Namespace('http://www.w3.org/1999/02/22-rdf-syntax-ns#');

class Solid {

    public async createResource(
        containerUrl: string,
        name: string,
        types: string[],
        basicType: string | null = null
    ): Promise<Resource> {
        // TODO why doesn't this function need Solid? Is the header already set within fetcher?

        const store = $rdf.graph();
        const fetcher = new $rdf.Fetcher(store, {});

        const result: Response = await (fetcher as any).webOperation('POST', containerUrl, {
            contentType: 'text/turtle',
            headers: {
                'content-type': 'text/turtle',
                // TODO test giving a task a slug
                ...(basicType
                    ? {
                        'link': basicType + '; rel="type"',
                        'slug': Str.slug(name),
                    }
                    : {}),
            },
            body:
                [
                    ...types.map(type => `<> a <${type}> .`),
                    `<> ${FOAF('name')} ${JSON.stringify(name)} .`,
                ].join("\n"),
        });

        // TODO this doesn't work, graph incomplete :(

        return {
            url: new URL(result.headers.get('Location') as string, containerUrl).href,
            types,
            name,
            graph: store,
        };
    }

    public async updateResourceProperties(
        resourceUrl: string,
        properties: { [property: string]: any }
    ): Promise<void> {
        // TODO why doesn't this function need Solid? Is the header already set within fetcher?

        const store = $rdf.graph();
        const fetcher = new $rdf.Fetcher(store, {});

        const inserts = Object.keys(properties).map((property: string) => {
            return [
                `<${resourceUrl}>`,
                `<${property}>`,
                JSON.stringify(properties[property].toString()),
            ].join(' ') + ' .';
        }).join("\n");

        await (fetcher as any).webOperation('PATCH', resourceUrl, {
            contentType: 'text/n3',
            headers: { 'content-type': 'text/n3' },
            body:
                `@prefix solid: <http://www.w3.org/ns/solid/terms#> .
                    <> solid:patches <${resourceUrl}>;
                    solid:inserts { ${inserts} }.`,
        });
    }

    public async removeResourceProperties(resourceUrl: string, properties: string[]): Promise<void> {
        // TODO why doesn't this function need Solid? Is the header already set within fetcher?

        const store = $rdf.graph();
        const fetcher = new $rdf.Fetcher(store, {});

        const where = properties.map((property: string) => {
            return [
                `<${resourceUrl}>`,
                `<${property}>`,
                '?date',
            ].join(' ') + ' .';
        }).join("\n");

        const deletes = properties.map((property: string) => {
            return [
                `<${resourceUrl}>`,
                `<${property}>`,
                '?date',
            ].join(' ') + ' .';
        }).join("\n");

        await (fetcher as any).webOperation('PATCH', resourceUrl, {
            contentType: 'text/n3',
            headers: { 'content-type': 'text/n3' },
            body:
                `@prefix solid: <http://www.w3.org/ns/solid/terms#> .
                    <> solid:patches <${resourceUrl}>;
                    solid:where   { ${where} };
                    solid:deletes { ${deletes} }.`,
        });
    }

    public async createContainer(
        parentUrl: string,
        name: string,
        types: string[]
    ): Promise<Resource> {
        return await this.createResource(
            parentUrl,
            name,
            types,
            LDP('BasicContainer').toString()
        );
    }

    public getResourceAttribute(
        resource: Resource,
        attribute: NamedNode | string,
        defaultValue: any
    ): any {
        return resource.graph.anyValue(
            $rdf.sym(resource.url),
            new NamedNode(attribute),
            null as any,
            null as any
        ) || defaultValue;
    }

    public async getResources(containerUrl: string, types: string[]): Promise<Resource[]> {
        return await this.getResourcesByType(containerUrl, types, LDP('Resource'));
    }

    public async getContainers(containerUrl: string, types: string[]): Promise<Resource[]> {
        return await this.getResourcesByType(containerUrl, types, LDP('BasicContainer'));
    }

    public async getUserFromSession(session: Session): Promise<User> {
        const VCARD = $rdf.Namespace('http://www.w3.org/2006/vcard/ns#');
        const FOAF = $rdf.Namespace('http://xmlns.com/foaf/0.1/');
        const PIM = $rdf.Namespace('http://www.w3.org/ns/pim/space#');

        const store = $rdf.graph();
        const fetcher = new $rdf.Fetcher(store, {});

        await (fetcher as any).load(session.webId);

        const webId = store.sym(session.webId);

        const name = store.any(webId, VCARD('fn'), null as any, null as any)
            || store.any(webId, FOAF('name'), null as any, null as any);

        const avatarUrl = store.any(webId, VCARD('hasPhoto'), null as any, null as any)
                || store.any(webId, FOAF('image'), null as any, null as any)
                || store.any(webId, FOAF('img'), null as any, null as any);

        const storages = store.each(webId, PIM('storage'), null as any, null as any);

        return {
            id: webId.value,
            name: name ? name.value : 'Unknown',
            avatarUrl: avatarUrl ? avatarUrl.value : null,
            storages: (storages || []).map($storage => $storage.value),
        };
    }

    private async getResourcesByType(
        containerUrl: string,
        types: string[],
        basicType: NamedNode
    ): Promise<Resource[]> {
        // TODO use SparQL instead to execute only one request

        try {
            const data = await SolidAuthClient.fetch(containerUrl).then(res => res.text());
            const store = $rdf.graph();

            $rdf.parse(data, store, containerUrl, 'text/turtle', null as any);

            const containerResources = store.each(
                null as any,
                RDFS('type'),
                basicType,
                null as any
            );

            const resources: Resource[] = [];

            outerLoop:
            for (const containerResource of containerResources) {
                try {
                    const resourceUrl = containerResource.value;
                    const resourceData = await SolidAuthClient.fetch(resourceUrl).then(res => res.text());
                    const resource = this.parseResource(resourceUrl, resourceData);

                    for (const type of types) {
                        if (resource.types.indexOf(type) === -1) {
                            continue outerLoop;
                        }
                    }

                    resources.push(resource);
                } catch (e) {
                    // Don't stop execution when finding a corrupt container
                    console.error(e);
                }
            }

            return resources;
        } catch (e) {
            console.error(e);

            return [];
        }
    }

    private parseResource(url: string, data: string): Resource {
        const store = $rdf.graph();

        $rdf.parse(data, store, url, 'text/turtle', null as any);

        const typeTerms = store.each(
            $rdf.sym(url),
            RDFS('type'),
            null as any,
            null as any
        );

        const resource = {
            url: url,
            name: 'Unknown',
            types: typeTerms.map(term => term.value),
            graph: store,
        };

        resource.name = this.getResourceAttribute(
            resource,
            FOAF('name'),
            resource.name
        );

        return resource;
    }

}

export interface Resource {
    url: string;
    name: string;
    types: string[];
    graph: Graph;
}

export interface User {
    id: string;
    name: string;
    avatarUrl: string | null;
    storages: string[];
}

export default new Solid();
