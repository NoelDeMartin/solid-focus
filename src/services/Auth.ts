import { Store } from 'vuex';

import Service from '@/services/Service';

import User from '@/models/User';

import EventBus from '@/utils/EventBus';

interface State<U=User> {
    user: U | null;
}

export default abstract class Auth<U=User> extends Service {

    public get loggedIn(): boolean {
        return !!this.storage.user;
    }

    public get user(): U | null {
        return this.storage.user;
    }

    public withUser<R>(callback: (user: U) => R): R {
        if (!this.user) {
            throw new Error('User not available');
        }

        return callback(this.user);
    }

    public abstract login(idp: string): Promise<void>;

    public abstract logout(): Promise<void>;

    protected get storage(): State<U> {
        return this.app.$store.state.auth
            ? this.app.$store.state.auth
            : {};
    }

    protected loginUser(user: U): void {
        this.app.$store.commit('setUser', user);
        EventBus.emit('login', user);
    }

    protected logoutUser(): void {
        this.app.$store.commit('setUser', null);
        EventBus.emit('logout');
    }

    protected async registerStoreModule(store: Store<State<U>>): Promise<void> {
        this.app.$store.registerModule('auth', {
            state: {
                user: null,
            },
            mutations: {
                setUser(state: State<U>, user: U | null) {
                    state.user = user;
                },
            },
        });
    }

}
