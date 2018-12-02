import User from '@/models/users/User';

export default class SolidUser extends User {

    public readonly id: string;
    public readonly pods: string[];

    constructor(
        id: string,
        name: string,
        avatarUrl: string | null,
        pods: string[],
    ) {
        super(name, avatarUrl);

        this.id = id;
        this.pods = pods.slice();
    }

}