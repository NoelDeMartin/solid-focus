export default class User {

    public readonly id: string;
    public readonly name: string | null;
    public readonly avatarUrl: string | null;

    constructor(id: string, name: string | null = null, avatarUrl: string | null = null) {
        this.id = id;
        this.name = name;
        this.avatarUrl = avatarUrl;
    }

}
