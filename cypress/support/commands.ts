import List from '@/models/soukai/List';
import Task from '@/models/soukai/Task';
import Workspace from '@/models/soukai/Workspace';

import { getApp, getRuntime } from '@cy/support/utils';

const customCommands = {

    start(): Cypress.Chainable<void> {
        return getRuntime().then(runtime => new Cypress.Promise<void>(resolve => {
            runtime.start().then(() => resolve());
        }));
    },

    require<T>(name: string): Cypress.Chainable<T> {
        return getRuntime().then(runtime => new Cypress.Promise<T>(resolve => {
            resolve(runtime.require(name));
        }));
    },

    login(): Cypress.Chainable<void> {
        return getApp().then(app => new Cypress.Promise<void>(resolve => {
            app.$auth.loginOffline().then(() => resolve());
        }));
    },

    createWorkspace(name: string): Cypress.Chainable<Workspace> {
        return getApp().then(app => new Cypress.Promise<Workspace>(resolve => {
            app.$workspaces.createWorkspace(name).then(workspace => resolve(workspace));
        }));
    },

    createList(workspace: Workspace, name: string): Cypress.Chainable<List> {
        return getApp().then(app => new Cypress.Promise<List>(resolve => {
            app.$workspaces.createList(workspace, name).then(list => resolve(list));
        }));
    },

    createTask(list: List, name: string): Cypress.Chainable<Task> {
        return getApp().then(app => new Cypress.Promise<Task>(resolve => {
            app.$workspaces.createTask(list, name).then(task => resolve(task));
        }));
    },

    toggleTask(task: Task): Cypress.Chainable<void> {
        return getApp().then(app => new Cypress.Promise<void>(resolve => {
            app.$workspaces.toggleTask(task).then(() => resolve());
        }));
    },

};

for (const command in customCommands) {
    Cypress.Commands.add(command, (customCommands as any)[command]);
}

export default customCommands;
