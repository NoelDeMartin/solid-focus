import User from '@/models/User';

export default class SolidUser implements User {

    public readonly id: string;
    public readonly name: string;
    public readonly avatarUrl: string | null;
    public readonly podUrl: string;
    public readonly storages: string[];

    constructor(
        id: string,
        name: string,
        avatarUrl: string | null,
        podUrl: string,
        storages: string[],
    ) {
        this.id = id;
        this.name = name;
        this.avatarUrl = avatarUrl;
        this.podUrl = podUrl;
        this.storages = storages.slice();
    }

}