import { Store } from 'vuex';

import SolidAuthClient, { Session } from 'solid-auth-client';

import Service from '@/services/Service';

import User from '@/models/User';
import OfflineUser from '@/models/users/OfflineUser';
import SolidUser from '@/models/users/SolidUser';

import Storage from '@/utils/Storage';
import Solid from '@/utils/Solid';
import Vue from 'vue';
import OfflineWorkspaces from './workspaces/OfflineWorkspaces';
import SolidWorkspaces from './workspaces/SolidWorkspaces';

enum Mode {
    Offline = 'offline',
    Solid = 'solid',
}

interface State {
    mode: Mode | null;
    user: User | null;
}

export default class Auth extends Service {

    public get loggedIn(): boolean {
        return !!this.storage.user;
    }

    public get user(): User | null {
        return this.storage.user;
    }

    public withUser<R>(callback: (user: User) => R): R {
        if (!this.user) {
            throw new Error('User not available');
        }

        return callback(this.user);
    }

    public async loginOffline(): Promise<void> {
        const user = new OfflineUser('Guest');

        await this.loginUser(user, Mode.Offline);

        Storage.set('user', user);
    }

    public async loginWithSolid(idp: string): Promise<void> {
        // TODO error not handled
        await SolidAuthClient.login(idp);
    }

    public async logout(): Promise<void> {
        if (this.loggedIn) {
            switch (this.storage.mode) {
                case Mode.Offline:
                    Storage.remove('user');
                    break;
                case Mode.Solid:
                    await SolidAuthClient.logout();
                    break;
            }

            this.logoutUser();
        }
    }

    protected get storage(): State {
        return this.app.$store.state.auth
            ? this.app.$store.state.auth
            : {};
    }

    protected async init(): Promise<void> {
        await super.init();

        const user = Storage.get('user');
        const onSessionUpdated = this.onSessionUpdated.bind(this);

        await SolidAuthClient.currentSession().then(onSessionUpdated);

        SolidAuthClient.trackSession(onSessionUpdated);

        if (user !== null) {
            await this.loginUser(user, Mode.Solid);
        }
    }

    protected async destroy(): Promise<void> {
        await super.destroy();

        // TODO stop tracking user session (not implemented in solid-auth-client)
    }

    protected async registerStoreModule(store: Store<State>): Promise<void> {
        store.registerModule('auth', {
            state: {
                mode: null,
                user: null,
            },
            mutations: {
                setUser(state: State, user: User | null) {
                    state.user = user;
                },
                setMode(state: State, mode: Mode | null) {
                    state.mode = mode;
                },
            },
        });
    }

    protected unregisterStoreModule(store: Store<State>): void {
        store.unregisterModule('auth');
    }

    protected async loginUser(user: User, mode: Mode): Promise<void> {
        this.app.$store.commit('setUser', user);
        this.app.$store.commit('setMode', mode);

        switch (mode) {
            case Mode.Offline:
                Vue.prototype.$workspaces = new OfflineWorkspaces(this.app);
                break;
            case Mode.Solid:
                Vue.prototype.$workspaces = new SolidWorkspaces(this.app);
                break;
        }

        await Vue.prototype.$workspaces.init();
    }

    protected async logoutUser(): Promise<void> {
        this.app.$store.commit('setUser', null);
        this.app.$store.commit('setMode', null);

        await Vue.prototype.$workspaces.destroy();

        delete Vue.prototype.$workspaces;
    }

    private async onSessionUpdated(session: Session | void): Promise<void> {
        if (session) {
            await this.loginFromSession(session);
        } else {
            this.logoutUser();
        }
    }

    private async loginFromSession(session: Session): Promise<void> {
        const user = await Solid.getUserFromSession(session);

        await this.loginUser(
            new SolidUser(
                user.id,
                user.name,
                user.avatarUrl,
                user.idp,
                user.storages
            ),
            Mode.Solid
        );
    }

}
