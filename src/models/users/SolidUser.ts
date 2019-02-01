import User from '@/models/users/User';

export default class SolidUser extends User {

    public readonly id: string;
    public readonly storages: string[];

    constructor(
        id: string,
        name: string,
        avatarUrl: string | null,
        storages: string[],
    ) {
        super(name, avatarUrl);

        this.id = id;
        this.storages = storages.slice();
    }

}