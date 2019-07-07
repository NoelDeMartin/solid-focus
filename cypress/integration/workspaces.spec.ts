import Faker from 'faker';

describe('Workspaces', () => {

    beforeEach(() => {
        cy.visit('/');
        cy.start();
        cy.login();
    });

    it('Creates a workspace', () => {
        const name = Faker.lorem.sentence();

        cy.get('[title="Create new workspace"]').click();

        cy.get('input').type(name).type('{enter}');

        cy.contains('#app-navigation-drawer', name).should('be.visible');
        cy.contains('.v-toolbar', 'Inbox').should('be.visible');
    });

    it('Creates a list', () => {
        const name = Faker.lorem.sentence();

        cy.createWorkspace(Faker.lorem.sentence());

        cy.contains('a', 'Create list').click();

        cy.get('.v-dialog').within(() => {
            cy.get('input').type(name).type('{enter}');
        });

        cy.contains('#app-navigation-drawer a', name).should('be.visible');
        cy.contains('.v-toolbar', name).should('be.visible');
    });

    it('Edits workspaces', () => {
        const name = Faker.lorem.sentence();
        const newName = Faker.lorem.sentence();

        cy.createWorkspace(name);

        cy.get('#app-navigation-drawer [title="Manage workspaces"]')
          .click();

        cy.contains('.v-menu__content .v-list__tile', name)
          .children('.v-list__tile__action')
          .then($el => $el.removeClass('reveal-on-hover'))
          .children('button[title="Edit workspace"]')
          .click();

        cy.get('.v-dialog').within(() => {
            cy.get('input').clear().type(newName).type('{enter}');
        });

        cy.contains('#app-navigation-drawer', newName).should('be.visible');
    });

    it('Edits lists', () => {
        const name = Faker.lorem.sentence();
        const newName = Faker.lorem.sentence();

        cy.createWorkspace(Faker.lorem.sentence()).then(workspace => {
            cy.createList(workspace, name);
        });

        cy.contains('#app-navigation-drawer .v-list__tile', name)
          .children('.v-list__tile__action')
          .then($el => $el.removeClass('reveal-on-hover'));

        cy.contains('#app-navigation-drawer .v-list__tile', name)
          .get('button[title="Edit list"]')
          .click();

        cy.get('.v-dialog').within(() => {
            cy.get('input').clear().type(newName).type('{enter}');
        });

        cy.contains('#app-navigation-drawer', newName).should('be.visible');
    });

    it('Switches lists', () => {
        const firstList = Faker.lorem.sentence();
        const secondList = Faker.lorem.sentence();
        const inboxTask = Faker.lorem.sentence();
        const firstListTask = Faker.lorem.sentence();
        const secondListTask = Faker.lorem.sentence();

        cy.createWorkspace(Faker.lorem.sentence()).then(workspace => {
            cy.createTask(workspace.inbox, inboxTask);
            cy.createList(workspace, firstList).then(list => {
                cy.createTask(list, firstListTask);
            });
            cy.createList(workspace, secondList).then(list => {
                cy.createTask(list, secondListTask);
            });
        });

        cy.contains('#app-navigation-drawer a', 'Inbox').click();
        cy.contains('.v-toolbar', 'Inbox').should('be.visible');
        cy.contains('.task-item', inboxTask).should('be.visible');
        cy.contains('.task-item', firstListTask).should('not.exist');
        cy.contains('.task-item', secondListTask).should('not.exist');

        cy.contains('#app-navigation-drawer a', firstList).click();
        cy.contains('.v-toolbar', firstList).should('be.visible');
        cy.contains('.task-item', inboxTask).should('not.exist');
        cy.contains('.task-item', firstListTask).should('be.visible');
        cy.contains('.task-item', secondListTask).should('not.exist');

        cy.contains('#app-navigation-drawer a', secondList).click();
        cy.contains('.v-toolbar', secondList).should('be.visible');
        cy.contains('.task-item', inboxTask).should('not.exist');
        cy.contains('.task-item', firstListTask).should('not.exist');
        cy.contains('.task-item', secondListTask).should('be.visible');
    });

});
