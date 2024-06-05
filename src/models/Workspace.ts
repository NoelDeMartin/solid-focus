import { arrayRandomItem } from '@noeldemartin/utils';
import { Router } from '@aerogel/plugin-routing';
import type { Relation } from 'soukai';
import type { SolidContainsRelation } from 'soukai-solid';

import TasksList from '@/models/TasksList';
import { WorkspaceColors } from '@/utils/colors';
import type { WorkspaceColor } from '@/utils/colors';

export default class Workspace extends TasksList {

    public declare lists?: TasksList[];
    public declare relatedLists: SolidContainsRelation<this, TasksList, typeof TasksList>;

    private _color: WorkspaceColor | null = null;

    public get routeAttributes(): { route: string; routeParams: Object } {
        return {
            route: 'workspace',
            routeParams: { workspace: this.slug },
        };
    }

    public get color(): WorkspaceColor {
        return (this._color ??= arrayRandomItem(Object.values(WorkspaceColors)) as WorkspaceColor);
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
