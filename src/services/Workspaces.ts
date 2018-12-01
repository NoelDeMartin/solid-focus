import { Store } from 'vuex';

import { Mode } from '@/services/Auth';
import Service from '@/services/Service';
import Backend from '@/services/backends/Backend';
import OfflineBackend from '@/services/backends/OfflineBackend';
import SolidBackend from '@/services/backends/SolidBackend';

import List from '@/models/List';
import Task from '@/models/Task';
import User from '@/models/users/User';
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

    public async createWorkspace(...args: any[]): Promise<Workspace> {
        const workspace = await this.backend.createWorkspace(...args);

        this.app.$store.commit('addWorkspace', workspace);
        this.app.$store.commit('setActiveWorkspace', workspace);

        return workspace;
    }

    public createList(workspace: Workspace, ...args: any[]): Promise<List> {
        return this.backend.createList(workspace, ...args);
    }

    public createTask(list: List, ...args: any[]): Promise<Task> {
        return this.backend.createTask(list, ...args);
    }

    public toggleTask(task: Task): Promise<void> {
        return this.backend.toggleTask(task);
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
                addWorkspace(state: State, workspace: Workspace) {
                    state.workspaces.push(workspace);
                },
            },
        });
    }

    protected unregisterStoreModule(store: Store<State>): void {
        store.unregisterModule('workspaces');
    }

    protected async updateBackend(): Promise<void> {
        switch (this.app.$auth.mode) {
            case Mode.Offline:
                this.backend = new OfflineBackend();
                break;
            case Mode.Solid:
                this.backend = new SolidBackend();
                break;
        }

        const workspaces = await this.backend.loadWorkspaces(this.app.$auth.user as User);

        this.app.$store.commit('setWorkspaces', workspaces);
        this.app.$store.commit(
            'setActiveWorkspace',
            workspaces.length > 0 ? workspaces[0] : null
        );
    }

    protected async removeBackend(): Promise<void> {
        await this.backend.unloadWorkspaces();

        delete this.backend;

        this.app.$store.commit('setWorkspaces', []);
        this.app.$store.commit('setActiveWorkspace', null);
    }

}
