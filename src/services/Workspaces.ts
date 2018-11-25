import { Store } from 'vuex';

import Service from '@/services/Service';

import Workspace from '@/models/Workspace';
import User from '@/models/User';
import List from '@/models/List';
import Task from '@/models/Task';

import EventBus from '@/utils/EventBus';

interface State {
    activeWorkspace: Workspace | null;
    workspaces: Workspace[];
}

export default abstract class Workspaces<U=User> extends Service {

    public get empty(): boolean {
        return !this.storage.workspaces || this.storage.workspaces.length === 0;
    }

    public get active(): Workspace | null {
        return this.storage.activeWorkspace;
    }

    public get all(): Workspace[] {
        return this.storage.workspaces;
    }

    public setActive(workspace: Workspace): void {
        this.app.$store.commit('setActiveWorkspace', workspace);
    }

    public abstract createWorkspace(...args: any[]): Promise<Workspace>;

    public abstract createList(workspace: Workspace, ...args: any[]): Promise<List>;

    public abstract createTask(list: List, ...args: any[]): Promise<Task>;

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

        // Auth service will be the one calling this, so this should always be true
        if (this.app.$auth.loggedIn) {
            await this.loadUserWorkspaces(this.app.$auth.user as any as U);
        }
    }

    protected registerStoreModule(store: Store<State>): void {
        store.registerModule('workspaces', {
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

    protected unregisterStoreModule(store: Store<State>): void {
        store.unregisterModule('workspaces');
    }

    protected abstract loadUserWorkspaces(user: U): Promise<void>;

}
