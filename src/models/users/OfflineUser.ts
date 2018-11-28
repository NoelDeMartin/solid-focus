import User from '@/models/users/User';

export default class OfflineUser extends User {

    constructor(name: string = 'Guest', avatarUrl: string | null = null) {
        super(name, avatarUrl);
    }

}
