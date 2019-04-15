import { FieldType, MultipleModelsRelation, SingleModelRelation } from 'soukai';
import { SolidModel } from 'soukai-solid';

import Task from '@/models/soukai/Task';
import Workspace from '@/models/soukai/Workspace';

export default class List extends SolidModel {

    public static ldpContainer = true;

    public static rdfContexts = {
        'lifecycle': 'http://purl.org/vocab/lifecycle/schema#',
    };

    public static rdfsClasses = ['lifecycle:TaskGroup'];

    public static fields = {
        name: FieldType.String,
    };

    public name!: string;

    public workspace!: Workspace;

    public tasks?: Task[];

    public get empty(): boolean {
        return this.isRelationLoaded('tasks') ? this.tasks!.length === 0 : true;
    }

    public get length(): number {
        return this.isRelationLoaded('tasks') ? this.tasks!.length : 0;
    }

    public workspaceRelationship(): SingleModelRelation {
        return this.isContainedBy(Workspace);
    }

    public tasksRelationship(): MultipleModelsRelation {
        return this.contains(Task);
    }

}
