import Task from '@/models/Task';
import Workspace from '@/models/Workspace';

// TODO <any> should be removed (solves circular default for now)
export default class List<W=Workspace<any>> {

    public workspace!: W;

    public name: string;
    public tasks: Task[];

    constructor(name: string, tasks: Task[] = []) {
        this.name = name;
        this.tasks = tasks.slice();
    }

    public get empty(): boolean {
        return this.tasks.length === 0;
    }

    public get length(): number {
        return this.tasks.length;
    }

    public setWorkspace(workspace: W): void {
        this.workspace = workspace;
    }

    public add(task: Task): void {
        this.tasks.push(task);
    }

}
