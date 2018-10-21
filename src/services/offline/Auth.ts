import BaseAuth from '@/services/Auth';

import Storage from '@/utils/Storage';

export default class Auth extends BaseAuth {

    public async login(idp: string): Promise<void> {
        this.app.$store.dispatch('login', {
            id: '1',
            name: 'Guest',
            avatarUrl: null,
            storages: [],
        });
        Storage.set('user', this.app.$store.state.user);
    }

    public async logout(): Promise<void> {
        this.app.$store.dispatch('logout');
        Storage.remove('user');
    }

    protected async init(): Promise<void> {
        const user = Storage.get('user');

        if (user !== null) {
            this.app.$store.dispatch('login', user);
        }
    }

}
