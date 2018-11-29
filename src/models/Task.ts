export interface TaskJson {
    id: any;
    name: string;
    completed_at?: number;
}

export default class Task {

    public static fromJson(json: TaskJson): Task {
        return new Task(
            json.id,
            json.name,
            json.completed_at
                ? new Date(json.completed_at)
                : undefined,
        );
    }

    public id: any;
    public name: string;
    public completedAt?: Date;

    constructor(id: any, name: string, completedAt?: Date) {
        this.id = id;
        this.name = name;
        this.completedAt = completedAt;
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
