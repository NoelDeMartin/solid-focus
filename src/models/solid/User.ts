import BaseUser from '@/models/User';

export default class User extends BaseUser {

    public readonly podUrl: string;
    public readonly storages: string[];

    constructor(
        id: string,
        name: string | null,
        avatarUrl: string | null,
        podUrl: string,
        storages: string[],
    ) {
        super(id, name, avatarUrl);

        this.podUrl = podUrl;
        this.storages = storages.slice();
    }

}