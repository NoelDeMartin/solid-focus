export default class Task {

    public id: any;
    public name: string;
    public completedAt?: Date;

    constructor(id: any, name: string, completedAt?: Date) {
        this.id = id;
        this.name = name;
        this.completedAt = completedAt;
    }

}
