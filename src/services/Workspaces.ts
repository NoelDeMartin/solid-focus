import { Store } from 'vuex';

import { Mode } from '@/services/Auth';
import Service from '@/services/Service';
import Backend from '@/services/backends/Backend';
import OfflineBackend from '@/services/backends/OfflineBackend';
import SolidBackend from '@/services/backends/SolidBackend';

import User from '@/models/User';
import List from '@/models/List';
import Task from '@/models/Task';
import Workspace from '@/models/Workspace';
import SolidUser from '@/models/users/SolidUser';

import EventBus from '@/utils/EventBus';

interface State {
    activeWorkspace: Workspace | null;
    workspaces: Workspace[];
}

export default class Workspaces extends Service {

    private backend!: Backend;

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

    public createWorkspace(...args: any[]): Promise<Workspace> {
        return this.backend.createWorkspace(...args);
    }

    public createList(workspace: Workspace, ...args: any[]): Promise<List> {
        return this.backend.createList(workspace, ...args);
    }

    public createTask(list: List, ...args: any[]): Promise<Task> {
        return this.backend.createTask(list, ...args);
    }

    public update(workspaces: Workspace[]): void {
        this.app.$store.commit('setWorkspaces', workspaces);
        this.app.$store.commit('setActiveWorkspace', workspaces[0]);
    }

    public addWorkspace(workspace: Workspace, activate: boolean = true): void {
        this.app.$store.commit('addWorkspace', { workspace, activate });
    }

    protected get storage(): State {
        return this.app.$store.state.workspaces
            ? this.app.$store.state.workspaces
            : {};
    }

    protected async init(): Promise<void> {
        await super.init();
        await this.app.$auth.ready;

        if (this.app.$auth.loggedIn) {
            await this.updateBackend();
        }

        EventBus.on('login', this.updateBackend.bind(this));
        EventBus.on('logout', this.removeBackend.bind(this));
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

    protected async updateBackend(): Promise<void> {
        if (this.backend) {
            await this.removeBackend();
        }

        const user = this.app.$auth.user as User;

        switch (this.app.$auth.mode) {
            case Mode.Offline:
                this.backend = new OfflineBackend(this.app, user);
                break;
            case Mode.Solid:
                this.backend = new SolidBackend(this.app, user as SolidUser);
                break;
        }

        await this.backend.ready;
    }

    protected async removeBackend(): Promise<void> {
        if (this.backend) {
            await this.backend.destroy();

            delete this.backend;
        }
    }

}
