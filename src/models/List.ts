import Task, { TaskJson } from '@/models/soukai/Task';
import Workspace from '@/models/Workspace';

export interface ListJson {
    id: any;
    name: string;
    tasks: TaskJson[];
}

export default class List {

    public static fromJson(json: ListJson): List {
        return new List(
            json.id,
            json.name,
            json.tasks.map(taskJson => Task.fromJson(taskJson)),
        );
    }

    public workspace!: Workspace;

    public id: any;
    public name: string;
    public tasks: Task[];

    public loaded: boolean = false;
    public loading: boolean = false;

    constructor(id: any, name: string, tasks: Task[] = []) {
        this.id = id;
        this.name = name;
        this.tasks = tasks.slice();
    }

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
            id: this.id,
            name: this.name,
            tasks: this.tasks.map(task => task.toJson()),
        };
    }

}
