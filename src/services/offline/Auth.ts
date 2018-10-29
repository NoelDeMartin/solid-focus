import BaseAuth from '@/services/Auth';

import User from '@/models/User';

import Storage from '@/utils/Storage';

export default class Auth extends BaseAuth {

    public async login(idp: string): Promise<void> {
        const user = new User('1', 'Guest');

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
