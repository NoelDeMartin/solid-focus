import type { BelongsToManyRelation, Relation } from 'soukai';

import TasksList from '@/models/TasksList';

import Model from './Workspace.schema';

export default class Workspace extends Model {

    public declare lists?: TasksList[];
    public declare relatedLists: BelongsToManyRelation<this, TasksList, typeof TasksList>;

    public listsRelationship(): Relation {
        return this.belongsToMany(TasksList, 'listIds');
    }

}
