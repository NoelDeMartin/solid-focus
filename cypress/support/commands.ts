import { getApp, getRuntime } from '@cy/support/utils';

Cypress.Commands.add('start', () => {
    getRuntime().then(async runtime => {
        await runtime.start();
    });
});

Cypress.Commands.add('login', () => {
    getApp().then(async app => {
        await app.$auth.loginOffline();
    });
});

Cypress.Commands.add('addWorkspace', name => {
    getApp().then(async app => {
        await app.$workspaces.createWorkspace(name);
    });
});
