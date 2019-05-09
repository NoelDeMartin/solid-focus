import { Store } from 'vuex';

import $rdf from 'rdflib';
import SolidAuthClient, { Session } from 'solid-auth-client';

import Service from '@/services/Service';

import User from '@/models/users/User';
import OfflineUser from '@/models/users/OfflineUser';
import SolidUser from '@/models/users/SolidUser';

import Storage from '@/utils/Storage';
import EventBus from '@/utils/EventBus';

interface State {
    mode: Mode | null;
    user: User | null;
}

export enum Mode {
    Offline = 'offline',
    Solid = 'solid',
}

export default class Auth extends Service {

    // Implement type guard so that user getter doesn't return null
    public get loggedIn(): boolean {
        return !!this.storage.user;
    }

    public get mode(): Mode | null {
        return this.storage.mode;
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
        const user = new OfflineUser();

        await this.loginUser(user, Mode.Offline);

        Storage.set('user', user);
    }

    public async loginWithSolid(idp: string): Promise<void> {
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
        const onSolidSessionUpdated = this.onSolidSessionUpdated.bind(this);

        try {
            await SolidAuthClient.currentSession().then(onSolidSessionUpdated);

            SolidAuthClient.trackSession(onSolidSessionUpdated);
        } catch (error) {
            // TODO handle session expiration properly instead of communicating
            // this like an error
            this.app.$ui.showError(
                "We couldn't validate your credentials, please login again"
            );

            await SolidAuthClient.logout();
            this.logoutUser();
        }

        if (user !== null) {
            await this.loginUser(user, Mode.Offline);
        }
    }

    public async destroy(): Promise<void> {
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
        if (!this.loggedIn) {
            this.app.$store.commit('setUser', user);
            this.app.$store.commit('setMode', mode);

            EventBus.emit('login', user);
        }
    }

    protected async logoutUser(): Promise<void> {
        if (this.loggedIn) {
            this.app.$store.commit('setUser', null);
            this.app.$store.commit('setMode', null);

            EventBus.emit('logout');
        }
    }

    private async onSolidSessionUpdated(session: Session | void): Promise<void> {
        if (session && !this.user) {
            await this.loginFromSession(session);
        } else if (!session && this.mode === Mode.Solid) {
            this.logoutUser();
        }
    }

    private async loginFromSession(session: Session): Promise<void> {
        const FOAF = $rdf.Namespace('http://xmlns.com/foaf/0.1/');
        const PIM = $rdf.Namespace('http://www.w3.org/ns/pim/space#');

        const store = $rdf.graph();
        const data = await SolidAuthClient.fetch(session.webId).then(res => res.text());

        $rdf.parse(data, store, session.webId, null as any, null as any);

        const webId = store.sym(session.webId);

        const name = store.any(webId, FOAF('name'), null as any, null as any);
        const avatarUrl = store.any(webId, FOAF('img'), null as any, null as any);
        const storages = store.each(webId, PIM('storage'), null as any, null as any);

        // TODO load extended profile to find additional storages

        await this.loginUser(
            new SolidUser(
                webId.value,
                name ? name.value : 'Unknown',
                avatarUrl ? avatarUrl.value : null,
                (storages || []).map($storage => $storage.value),
            ),
            Mode.Solid
        );
    }

}
