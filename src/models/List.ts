import Task from '@/models/Task';

export default class List {

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

    public add(task: Task): void {
        this.tasks.push(task);
    }

}
