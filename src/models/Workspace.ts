import { Router } from '@aerogel/plugin-routing';
import type { Relation } from 'soukai';
import type { SolidContainsRelation } from 'soukai-solid';

import TasksList from '@/models/TasksList';

export default class Workspace extends TasksList {

    public declare lists?: TasksList[];
    public declare relatedLists: SolidContainsRelation<this, TasksList, typeof TasksList>;

    public get routeAttributes(): { route: string; routeParams: Object } {
        return {
            route: 'workspace',
            routeParams: { workspace: this.slug },
        };
    }

    public listsRelationship(): Relation {
        return this.contains(TasksList);
    }

    public async open(list?: TasksList): Promise<void> {
        await Router.push({
            name: 'workspace',
            params: {
                workspace: this.slug,
                list: list?.slug ?? '',
            },
        });
    }

}
