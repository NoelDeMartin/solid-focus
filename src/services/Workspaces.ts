import { ActionPayload } from 'vuex';

import Service from '@/services/Service';

import { User } from '@/services/Auth';

import { State } from '@/store';

export interface Workspace {
    name: string;
}

export default abstract class Workspaces extends Service {

    public get empty(): boolean {
        return this.app.$store.state.workspaces.length === 0;
    }

    public get active(): Workspace {
        const state = this.app.$store.state;

        return state.workspaces[state.activeWorkspace] as Workspace;
    }

    public abstract create(name: string): Promise<void>;

    protected async init(): Promise<void> {
        const Store = this.app.$store;
        const Auth = this.app.$auth;

        await Auth.ready;

        Store.subscribeAction((mutation: ActionPayload, state: State) => {
            switch (mutation.type) {
                case 'login':
                    this.loadUserWorkspaces(Auth.user);
                    break;
                case 'logout':
                    Store.dispatch('clearWorkspaces');
                    break;
            }
        });

        if (Auth.loggedIn) {
            await this.loadUserWorkspaces(Auth.user);
        }
    }

    protected abstract loadUserWorkspaces(user: User): Promise<void>;

}
