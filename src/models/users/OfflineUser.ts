import User from '@/models/User';

export default class OfflineUser implements User {

    public readonly name: string;
    public readonly avatarUrl: string | null;

    constructor(name: string, avatarUrl: string | null = null) {
        this.name = name;
        this.avatarUrl = avatarUrl;
    }

}
