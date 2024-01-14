import type { BelongsToManyRelation, Relation } from 'soukai';

import Task from '@/models/Task';

import Model from './Workspace.schema';

export default class Workspace extends Model {

    public declare tasks?: Task[];
    public declare relatedTasks: BelongsToManyRelation<this, Task, typeof Task>;

    public tasksRelationship(): Relation {
        return this.belongsToMany(Task);
    }

}
