import { Router } from '@aerogel/plugin-routing';
import type { Relation } from 'soukai';
import type { SolidContainsRelation } from 'soukai-solid';

import TasksList from '@/models/TasksList';
import { THEME_COLORS } from '@/utils/colors';
import type { ThemeColor } from '@/utils/colors';

import Model from './Workspace.schema';

export default class Workspace extends Model {

    public declare lists?: TasksList[];
    public declare relatedLists: SolidContainsRelation<this, TasksList, typeof TasksList>;

    public get routeAttributes(): { route: string; routeParams: Object } {
        return {
            route: 'workspace',
            routeParams: { workspace: this.slug },
        };
    }

    public get themeColor(): ThemeColor {
        return this.color && this.color in THEME_COLORS ? (this.color as ThemeColor) : 'sky';
    }

    public listsRelationship(): Relation {
        return this.contains(TasksList);
    }

    public async open(list?: TasksList): Promise<void> {
        await Router.push({
            name: 'workspace',
            params: {
                workspace: this.slug,
                list: list instanceof Workspace ? '' : list?.slug ?? '',
            },
        });
    }

}
