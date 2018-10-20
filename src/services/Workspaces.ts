import { ActionPayload } from 'vuex';

import Service from '@/services/Service';
import { Workspace, Workspaces as WorkspacesInterface } from '@/services/types/Workspaces';
import { User } from '@/services/types/Auth';

import { State } from '@/store';

export default class Workspaces extends Service implements WorkspacesInterface {

    public get empty(): boolean {
        return this.app.$store.state.workspaces.length === 0;
    }

    public get active(): Workspace {
        const state = this.app.$store.state;

        return state.workspaces[state.activeWorkspace] as Workspace;
    }

    public async create(name: string): Promise<void> {
        // TODO
    }

    protected async init(): Promise<void> {
        const Store = this.app.$store;
        const Auth = this.app.$auth;

        await Auth.ready;

        Store.subscribeAction((mutation: ActionPayload, state: State) => {
            switch (mutation.type) {
                case 'login':
                    this.loadWorkspacesFromUser(Auth.user);
                    break;
                case 'logout':
                    Store.dispatch('clearWorkspaces');
                    break;
            }
        });

        if (Auth.loggedIn) {
            await this.loadWorkspacesFromUser(Auth.user);
        }
    }

    private async loadWorkspacesFromUser(user: User): Promise<void> {
        // TODO
    }

}
