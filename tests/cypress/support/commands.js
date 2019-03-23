import { getApp } from './utils';

Cypress.Commands.add('login', () => {
    cy.visit('/');

    getApp().then(app => {
        app.$auth.loginOffline();
    });
});

Cypress.Commands.add('addWorkspace', name => {
    getApp().then(app => {
        app.$workspaces.createWorkspace(name);
    });
});
