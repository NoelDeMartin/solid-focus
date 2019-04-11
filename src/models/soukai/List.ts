import { FieldType } from 'soukai';
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

    // TODO replace with relationship
    public workspace!: Workspace;

    // TODO replace with relationship
    public tasks: Task[] = [];

    public get empty(): boolean {
        return this.tasks.length === 0;
    }

    public get length(): number {
        return this.tasks.length;
    }

    public setWorkspace(workspace: Workspace): void {
        this.workspace = workspace;
    }

    public add(task: Task): void {
        this.tasks.push(task);
    }

    public toJson(): ListJson {
        return {
            id: this.url,
            name: this.name,
            tasks: this.tasks.map(task => task.toJson()),
        };
    }

}
