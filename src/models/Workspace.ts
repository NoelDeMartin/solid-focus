import { Router } from '@aerogel/plugin-routing';
import { UI } from '@aerogel/core';
import type { Relation } from 'soukai';
import type { SolidContainsRelation } from 'soukai-solid';

import TasksList from '@/models/TasksList';
import WorkspaceSettingsModal from '@/pages/workspace/components/modals/WorkspaceSettingsModal.vue';

import Model from './Workspace.schema';

export default class Workspace extends Model {

    declare public lists?: TasksList[];
    declare public relatedLists: SolidContainsRelation<this, TasksList, typeof TasksList>;

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
                list: list instanceof Workspace ? '' : (list?.slug ?? ''),
            },
        });
    }

    public async edit(): Promise<void> {
        await UI.modal(WorkspaceSettingsModal, { workspace: this });
    }

}
