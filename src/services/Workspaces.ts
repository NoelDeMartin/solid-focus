import { Store } from 'vuex';

import Service from '@/services/Service';

import { User } from '@/services/Auth';

import EventBus from '@/utils/EventBus';

interface State {
    activeWorkspace: Workspace | null;
    workspaces: Workspace[];
}

export interface Workspace {
    name: string;
}

export default abstract class Workspaces extends Service {

    public get empty(): boolean {
        return !this.storage.workspaces || this.storage.workspaces.length === 0;
    }

    public get active(): Workspace | null {
        return this.storage.activeWorkspace;
    }

    public get workspaces(): Workspace[] {
        return this.storage.workspaces;
    }

    public abstract create(name: string): Promise<void>;

    protected get storage(): State {
        return this.app.$store.state.workspaces
            ? this.app.$store.state.workspaces
            : {};
    }

    protected initWorkspaces(workspaces: Workspace[]): void {
        this.app.$store.commit('setWorkspaces', workspaces);
        this.app.$store.commit('setActiveWorkspace', workspaces[0]);
    }

    protected addWorkspace(workspace: Workspace, activate: boolean = true): void {
        this.app.$store.commit('addWorkspace', { workspace, activate });
    }

    protected async init(): Promise<void> {
        await super.init();

        const Auth = this.app.$auth;

        await Auth.ready;

        if (Auth.loggedIn) {
            await this.loadUserWorkspaces(Auth.user as User);
        }

        EventBus.on('login', this.loadUserWorkspaces.bind(this));

        EventBus.on('logout', () => {
            this.app.$store.commit('setWorkspaces', []);
        });
    }

    protected registerStoreModule(store: Store<State>): void {
        this.app.$store.registerModule('workspaces', {
            state: {
                activeWorkspace: null,
                workspaces: [],
            },
            mutations: {
                setActiveWorkspace(state: State, activeWorkspace: Workspace | null) {
                    state.activeWorkspace = activeWorkspace;
                },
                setWorkspaces(state: State, workspaces: Workspace[]) {
                    state.workspaces = workspaces;
                },
                addWorkspace(state: State, payload: { workspace: Workspace, activate: boolean }) {
                    state.workspaces.push(payload.workspace);

                    if (payload.activate) {
                        state.activeWorkspace = payload.workspace;
                    }
                },
            },
        });
    }

    protected abstract loadUserWorkspaces(user: User): Promise<void>;

}
