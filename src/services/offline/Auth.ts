import BaseAuth, { User } from '@/services/Auth';

import Storage from '@/utils/Storage';

export default class Auth extends BaseAuth<User> {

    public async login(idp: string): Promise<void> {
        const user = {
            id: '1',
            name: 'Guest',
            avatarUrl: null,
            storages: [],
        };

        this.loginUser(user);

        Storage.set('user', user);
    }

    public async logout(): Promise<void> {
        this.logoutUser();

        Storage.remove('user');
    }

    protected async init(): Promise<void> {
        await super.init();

        const user = Storage.get('user');

        if (user !== null) {
            this.loginUser(user);
        }
    }

}
