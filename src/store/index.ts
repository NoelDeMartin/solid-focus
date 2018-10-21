import Vue from 'vue';
import Vuex, { ActionContext } from 'vuex';

import { User } from '@/services/Auth';
import { Workspace } from '@/services/Workspaces';

Vue.use(Vuex);

export interface State {
    user: null | User;
    activeWorkspace: null | number;
    workspaces: Workspace[];
}

export default new Vuex.Store({
    state: {
        user: null,
        activeWorkspace: null,
        workspaces: [],
    },
    mutations: {
        setUser(state: State, user: User) {
            state.user = user;
        },
        setActiveWorkspace(state: State, activeWorkspace: null | number) {
            state.activeWorkspace = activeWorkspace;
        },
        setWorkspaces(state: State, workspaces: Workspace[]) {
            state.workspaces = workspaces;
        },
        addWorkspace(state: State, payload: { workspace: Workspace, activate: boolean }) {
            state.workspaces.push(payload.workspace);

            if (payload.activate) {
                state.activeWorkspace = state.workspaces.indexOf(payload.workspace);
            }
        },
    },
    actions: {
        login(context: ActionContext<State, State>, user: User) {
            context.commit('setUser', user);
        },
        logout(context: ActionContext<State, State>) {
            context.commit('setUser', null);
        },
        initWorkspaces(context: ActionContext<State, State>, workspaces: Workspace[]) {
            context.commit('setActiveWorkspace', 0);
            context.commit('setWorkspaces', workspaces);
        },
        addWorkspace(context: ActionContext<State, State>, workspace: Workspace) {
            context.commit('addWorkspace', { workspace, activate: true });
        },
        clearWorkspaces(context: ActionContext<State, State>) {
            context.commit('setWorkspaces', []);
        },
    },
});
