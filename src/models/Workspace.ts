import { stringToSlug } from '@noeldemartin/utils';
import type { BelongsToManyRelation, Relation } from 'soukai';

import TasksList from '@/models/TasksList';

import Model from './Workspace.schema';

export default class Workspace extends Model {

    public declare lists?: TasksList[];
    public declare relatedLists: BelongsToManyRelation<this, TasksList, typeof TasksList>;

    public get slug(): string | undefined {
        return this.name && stringToSlug(this.name);
    }

    public listsRelationship(): Relation {
        return this.belongsToMany(TasksList, 'listIds');
    }

}
