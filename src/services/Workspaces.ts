import { Store } from 'vuex';

import Service from '@/services/Service';

import User from '@/models/users/User';
import Workspace from '@/models/soukai/Workspace';

import EventBus from '@/utils/EventBus';

interface State {
    activeWorkspace: Workspace | null;
    workspaces: Workspace[];
}

export default class Workspaces extends Service {

    public get empty(): boolean {
        return !this.storage.workspaces || this.storage.workspaces.length === 0;
    }

    public get active(): Workspace | null {
        return this.storage.activeWorkspace;
    }

    public get all(): Workspace[] {
        return this.storage.workspaces;
    }

    public async setActive(workspace: Workspace): Promise<void> {
        this.app.$store.commit('setActiveWorkspace', workspace);
    }

    public add(workspace: Workspace, activate: boolean = true): void {
        this.app.$store.commit('addWorkspace', workspace);

        if (activate) {
            this.app.$store.commit('setActiveWorkspace', workspace);
        }
    }

    protected get storage(): State {
        return this.app.$store.state.workspaces
            ? this.app.$store.state.workspaces
            : {};
    }

    protected async init(): Promise<void> {
        await super.init();
        await this.app.$auth.ready;

        if (this.app.$auth.isLoggedIn()) {
            await this.load(this.app.$auth.user);
        }

        EventBus.on('login', this.load.bind(this));
        EventBus.on('logout', this.unload.bind(this));
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

    protected async load(user: User): Promise<void> {
        const workspaces: Workspace[] = [];

        for (const storage of user.storages) {
            workspaces.push(
                ...(await Workspace.from(storage).all<Workspace>()),
            );
        }

        const activeWorkspace = workspaces.length > 0 ? workspaces[0] : null;

        if (activeWorkspace && !activeWorkspace.isRelationLoaded('lists')) {
            await activeWorkspace.loadRelation('lists');

            // TODO this could be done automatically in Soukai
            for (const list of activeWorkspace.lists!) {
                list.setRelationModels('workspace', activeWorkspace);
            }
        }

        if (activeWorkspace && !activeWorkspace.activeList.isRelationLoaded('tasks')) {
            await activeWorkspace.activeList.loadRelation('tasks');
        }

        this.app.$store.commit('setWorkspaces', workspaces);
        this.app.$store.commit('setActiveWorkspace', activeWorkspace);
    }

    protected async unload(): Promise<void> {
        this.app.$store.commit('setWorkspaces', []);
        this.app.$store.commit('setActiveWorkspace', null);
    }

}
