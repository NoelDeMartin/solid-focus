import Service from '@/services/Service';
import { Store } from 'vuex';
import EventBus from '@/utils/EventBus';

interface State {
    user: User | null;
}

export interface User {
    id: string;
    name: string | null;
    avatarUrl: string | null;
}

export default abstract class Auth extends Service {

    public get loggedIn(): boolean {
        return !!this.storage.user;
    }

    public get user(): User | null {
        return this.storage.user;
    }

    public withUser<T>(callback: (user: User) => T): T {
        if (!this.user) {
            throw new Error('User not available');
        }

        return callback(this.user);
    }

    public abstract login(idp: string): Promise<void>;

    public abstract logout(): Promise<void>;

    protected get storage(): State {
        return this.app.$store.state.auth
            ? this.app.$store.state.auth
            : {};
    }

    protected loginUser(user: User): void {
        this.app.$store.commit('setUser', user);
        EventBus.emit('login', user);
    }

    protected logoutUser(): void {
        this.app.$store.commit('setUser', null);
        EventBus.emit('logout');
    }

    protected async registerStoreModule(store: Store<State>): Promise<void> {
        this.app.$store.registerModule('auth', {
            state: {
                user: null,
            },
            mutations: {
                setUser(state: State, user: User | null) {
                    state.user = user;
                },
            },
        });
    }

}
