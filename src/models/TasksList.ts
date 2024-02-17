import { requireBootedModel } from 'soukai';
import { SolidContainer } from 'soukai-solid';
import type { Relation } from 'soukai';
import type { SolidContainsRelation, SolidIsContainedByRelation } from 'soukai-solid';

import Task from '@/models/Task';
import type Workspace from '@/models/Workspace';

export default class TasksList extends SolidContainer {

    public declare workspace?: Workspace;
    public declare relatedWorkspace: SolidIsContainedByRelation<this, Workspace, typeof Workspace>;
    public declare tasks?: Task[];
    public declare relatedTasks: SolidContainsRelation<this, Task, typeof Task>;

    public get slug(): string | undefined {
        return this.url.slice(this.workspace?.url.length || this.static().collection.length, -1);
    }

    public workspaceRelationship(): Relation {
        return this.isContainedBy(requireBootedModel<typeof Workspace>('Workspace'));
    }

    public tasksRelationship(): Relation {
        return this.contains(Task);
    }

}
