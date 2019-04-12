import { FieldType, MultipleModelsRelation } from 'soukai';
import { SolidModel } from 'soukai-solid';

import Task, { TaskJson } from '@/models/soukai/Task';
import Workspace from '@/models/Workspace';

export interface ListJson {
    id: any;
    name: string;
    tasks: TaskJson[];
}

export default class List extends SolidModel {

    public static ldpContainer = true;

    public static rdfContexts = {
        'lifecycle': 'http://purl.org/vocab/lifecycle/schema#',
    };

    public static rdfsClasses = ['lifecycle:TaskGroup'];

    public static fields = {
        name: FieldType.String,
    };

    public static fromJson(json: ListJson): List {
        const list = new List(
            {
                url: json.id,
                name: json.name,
            },
            true,
        );

        list.tasks = json.tasks.map(taskJson => Task.fromJson(taskJson));

        return list;
    }

    public static classFields = ['workspace'];

    // TODO replace with relationship
    public workspace!: Workspace;

    public get empty(): boolean {
        return this.tasks.length === 0;
    }

    public get length(): number {
        return this.tasks.length;
    }

    public tasksRelationship(): MultipleModelsRelation {
        return this.contains(Task);
    }

    public setWorkspace(workspace: Workspace): void {
        this.workspace = workspace;
    }

    public toJson(): ListJson {
        return {
            id: this.url,
            name: this.name,
            tasks: this.isRelationLoaded('tasks')
                ? this.tasks.map((task: Task) => task.toJson())
                : [],
        };
    }

}
