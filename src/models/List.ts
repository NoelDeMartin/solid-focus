import Task from '@/models/Task';
import Workspace from '@/models/Workspace';

export default class List {

    public workspace!: Workspace;

    public id: any;
    public name: string;
    public tasks: Task[];

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

}
