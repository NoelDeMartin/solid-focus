import { UI, translate } from '@aerogel/core';
import { requireBootedModel } from 'soukai';
import type { Relation } from 'soukai';
import type { SolidContainsRelation, SolidIsContainedByRelation } from 'soukai-solid';

import Task from '@/models/Task';
import type Workspace from '@/models/Workspace';

import Model from './TasksList.schema';

export default class TasksList extends Model {

    declare public workspace?: Workspace;
    declare public relatedWorkspace: SolidIsContainedByRelation<this, Workspace, typeof Workspace>;
    declare public tasks?: Task[];
    declare public relatedTasks: SolidContainsRelation<this, Task, typeof Task>;

    public get slug(): string | undefined {
        return this.url.slice(this.url.slice(0, -1).lastIndexOf('/') + 1, -1);
    }

    public get routeAttributes(): { route: string; routeParams: Object } {
        return {
            route: 'workspace',
            routeParams: { workspace: this.workspace?.slug, list: this.slug },
        };
    }

    public workspaceRelationship(): Relation {
        return this.isContainedBy(requireBootedModel<typeof Workspace>('Workspace'));
    }

    public tasksRelationship(): Relation {
        return this.contains(Task);
    }

    public async edit(): Promise<void> {
        const name = await UI.prompt(translate('lists.edit'), {
            label: translate('lists.name'),
            defaultValue: this.name,
            acceptText: translate('ui.save'),
            cancelVariant: 'secondary',
        });

        if (!name) {
            return;
        }

        await this.update({ name });
    }

}
