import { Store } from 'vuex';

import Service from '@/services/Service';

import { User } from '@/services/Auth';

import EventBus from '@/utils/EventBus';

interface State<W extends Workspace> {
    activeWorkspace: W | null;
    workspaces: W[];
}

export interface Workspace {
    name: string;
}

export default abstract class Workspaces<W extends Workspace, U extends User> extends Service {

    public get empty(): boolean {
        return !this.storage.workspaces || this.storage.workspaces.length === 0;
    }

    public get active(): W | null {
        return this.storage.activeWorkspace;
    }

    public get all(): W[] {
        return this.storage.workspaces;
    }

    public setActive(workspace: W): void {
        this.app.$store.commit('setActiveWorkspace', workspace);
    }

    public abstract create(...args: any[]): Promise<void>;

    protected get storage(): State<W> {
        return this.app.$store.state.workspaces
            ? this.app.$store.state.workspaces
            : {};
    }

    protected initWorkspaces(workspaces: W[]): void {
        this.app.$store.commit('setWorkspaces', workspaces);
        this.app.$store.commit('setActiveWorkspace', workspaces[0]);
    }

    protected addWorkspace(workspace: W, activate: boolean = true): void {
        this.app.$store.commit('addWorkspace', { workspace, activate });
    }

    protected async init(): Promise<void> {
        await super.init();

        const Auth = this.app.$auth;

        await Auth.ready;

        if (Auth.loggedIn) {
            await this.loadUserWorkspaces(Auth.user as U);
        }

        EventBus.on('login', this.loadUserWorkspaces.bind(this));

        EventBus.on('logout', () => {
            this.app.$store.commit('setWorkspaces', []);
        });
    }

    protected registerStoreModule(store: Store<State<W>>): void {
        this.app.$store.registerModule('workspaces', {
            state: {
                activeWorkspace: null,
                workspaces: [],
            },
            mutations: {
                setActiveWorkspace(state: State<W>, activeWorkspace: W | null) {
                    state.activeWorkspace = activeWorkspace;
                },
                setWorkspaces(state: State<W>, workspaces: W[]) {
                    state.workspaces = workspaces;
                },
                addWorkspace(state: State<W>, payload: { workspace: W, activate: boolean }) {
                    state.workspaces.push(payload.workspace);

                    if (payload.activate) {
                        state.activeWorkspace = payload.workspace;
                    }
                },
            },
        });
    }

    protected abstract loadUserWorkspaces(user: U): Promise<void>;

}
