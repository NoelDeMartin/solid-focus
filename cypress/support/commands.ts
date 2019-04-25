import { getApp, getRuntime } from '@cy/support/utils';

Cypress.Commands.add('start', () => {
    getRuntime().then(runtime => new Cypress.Promise(resolve => {
        runtime.start().then(() => resolve());
    }));
});

Cypress.Commands.add('require', name => {
    getRuntime().then(runtime => new Cypress.Promise(resolve => {
        resolve(runtime.require(name));
    }));
});

Cypress.Commands.add('login', () => {
    getApp().then(app => new Cypress.Promise(resolve => {
        app.$auth.loginOffline().then(() => resolve());
    }));
});

Cypress.Commands.add('addWorkspace', name => {
    getApp().then(app => new Cypress.Promise(resolve => {
        app.$workspaces.createWorkspace(name).then(() => resolve());
    }));
});
