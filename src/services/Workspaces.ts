import { SolidEngine } from 'soukai-solid';
import { Store } from 'vuex';
import Soukai, { LocalStorageEngine } from 'soukai';

import Service from '@/services/Service';

import SolidUser from '@/models/users/SolidUser';
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

        if (this.app.$auth.loggedIn) {
            await this.load(this.app.$auth.user as User);
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
        let storages: string[];

        if (user instanceof SolidUser) {
            Soukai.useEngine(new SolidEngine());
            storages = user.storages;
        } else {
            Soukai.useEngine(new LocalStorageEngine('solid-focus-'));
            storages = [Workspace.collection];
        }

        const workspaces: Workspace[] = [];

        for (const storage of storages) {
            workspaces.push(
                ...(await Workspace.from(storage).all<Workspace>()),
            );
        }

        const activeWorkspace = workspaces.length > 0 ? workspaces[0] : null;

        if (activeWorkspace && !activeWorkspace.isRelationLoaded('lists')) {
            await activeWorkspace.loadRelation('lists');

            // TODO this could be done automatically in Soukai
            for (const list of activeWorkspace.lists!) {
                list.setRelation('workspace', activeWorkspace);
            }
        }

        if (activeWorkspace && !activeWorkspace.activeList.isRelationLoaded('tasks')) {
            await activeWorkspace.activeList.loadRelation('tasks');
        }

        this.app.$store.commit('setWorkspaces', workspaces);
        this.app.$store.commit('setActiveWorkspace', activeWorkspace);
    }

    protected async unload(): Promise<void> {
        if (Soukai.engine instanceof LocalStorageEngine) {
            (Soukai.engine as LocalStorageEngine).clear();
        }

        this.app.$store.commit('setWorkspaces', []);
        this.app.$store.commit('setActiveWorkspace', null);
    }

}
