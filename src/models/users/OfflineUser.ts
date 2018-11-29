import User from '@/models/users/User';

export default class OfflineUser extends User {

    constructor(name: string = 'Local (offline)', avatarUrl: string | null = null) {
        super(name, avatarUrl);
    }

}
