import { Store } from 'vuex';

import Service from '@/services/Service';

import User from '@/models/users/User';
import Workspace from '@/models/soukai/Workspace';

import EventBus from '@/utils/EventBus';
import Storage from '@/utils/Storage';

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

    public async setActive(workspace: Workspace | null): Promise<void> {
        this.app.$store.commit('setActiveWorkspace', workspace);

        if (workspace)
            Storage.set('activeWorkspaceId', workspace.id);
        else
            Storage.remove('activeWorkspaceId');
    }

    public add(workspace: Workspace, activate: boolean = true): void {
        this.app.$store.commit('addWorkspace', workspace);

        if (activate)
            this.setActive(workspace);
    }

    public remove(workspace: Workspace): void {
        this.app.$store.commit('removeWorkspace', workspace);

        this.setActive(this.all.length > 0 ? this.all[0] : null);
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
                removeWorkspace(state: State, workspace: Workspace) {
                    const index = state.workspaces.findIndex(existingWorkspace => existingWorkspace === workspace);

                    if (index !== -1) {
                        state.workspaces.splice(index, 1);
                    }
                },
            },
        });
    }

    protected unregisterStoreModule(store: Store<State>): void {
        store.unregisterModule('workspaces');
    }

    protected async load(user: User): Promise<void> {
        const workspaces: Workspace[] = [];
        const activeWorkspaceId = Storage.get('activeWorkspaceId');
        const activeListId = Storage.get('activeListId');

        let activeWorkspace;

        for (const storage of user.storages) {
            workspaces.push(
                ...(await Workspace.from(storage).all<Workspace>()),
            );
        }

        activeWorkspace = workspaces.find(workspace => workspace.id === activeWorkspaceId);

        if (!activeWorkspace && workspaces.length > 0)
            activeWorkspace = workspaces[0];

        if (activeWorkspace)
            await this.loadWorkspace(activeWorkspace, activeListId);

        this.app.$store.commit('setWorkspaces', workspaces);
        this.app.$store.commit('setActiveWorkspace', activeWorkspace);
    }

    protected async unload(): Promise<void> {
        this.app.$store.commit('setWorkspaces', []);
        this.app.$store.commit('setActiveWorkspace', null);

        Storage.remove('activeWorkspaceId');
        Storage.remove('activeListId');
    }

    private async loadWorkspace(workspace: Workspace, activeListId: string): Promise<void> {
        if (!workspace.isRelationLoaded('lists')) {
            await workspace.loadRelation('lists');

            // TODO this could be done automatically in Soukai
            for (const list of workspace.lists!) {
                list.setRelationModels('workspace', workspace);
            }
        }

        workspace.setActiveList(
            workspace.lists!.find(list => list.id === activeListId) ||
            workspace.activeList,
        );

        if (workspace && !workspace.activeList.isRelationLoaded('tasks'))
            await workspace.activeList.loadRelation('tasks');
    }
}
