export default abstract class User {

    public name: string;
    public avatarUrl: string | null;

    constructor(name: string, avatarUrl: string | null) {
        this.name = name;
        this.avatarUrl = avatarUrl;
    }

}
