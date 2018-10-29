export default class Task {

    public id: string;
    public name: string;
    public completed: boolean;

    constructor(id: string, name: string, completed: boolean = false) {
        this.id = id;
        this.name = name;
        this.completed = completed;
    }

}
