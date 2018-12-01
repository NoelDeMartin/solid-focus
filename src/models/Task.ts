export interface TaskJson {
    id: any;
    name: string;
    completed_at?: number;
}

interface CompletedTask {
    completedAt: Date;
}

export default class Task {

    public static fromJson(json: TaskJson): Task {
        return new Task(
            json.id,
            json.name,
            json.completed_at
                ? new Date(json.completed_at)
                : null,
        );
    }

    public id: any;
    public name: string;
    public completedAt: Date | null;

    constructor(id: any, name: string, completedAt: Date | null = null) {
        this.id = id;
        this.name = name;
        this.completedAt = completedAt;
    }

    get completed(): boolean {
        return !!this.completedAt;
    }

    public isCompleted(): this is CompletedTask {
        return this.completed;
    }

    public toggle(): void {
        this.completedAt = this.completed ? null : new Date;
    }

    public toJson(): any {
        const json: TaskJson = {
            id: this.id,
            name: this.name,
        };

        if (this.completedAt) {
            json.completed_at = this.completedAt.getTime();
        }

        return json;
    }

}
