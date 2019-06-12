import Faker from 'faker';

describe('Data Management', () => {

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

        cy.contains('a', 'Add List').click();

        cy.get('.v-dialog').within(() => {
            cy.get('input').type(name).type('{enter}');
        });

        cy.contains('#app-navigation-drawer a', name).should('be.visible');
        cy.contains('.v-toolbar', name).should('be.visible');
    });

    it('Creates a task', () => {
        const name = Faker.lorem.sentence();

        cy.createWorkspace(Faker.lorem.sentence());

        cy.get('input').type(name).type('{enter}');

        cy.contains('.task-item', name).should('be.visible');
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

    it('Checks tasks', () => {
        const name = Faker.lorem.sentence();

        cy.createWorkspace(Faker.lorem.sentence()).then(workspace => {
            cy.createTask(workspace.inbox, name);
        });

        cy.contains('.task-item', name)
          .parent()
          .find('.v-input--checkbox')
          .click();

        cy.contains('.task-item', name)
          .should('not.exist');

        cy.contains('button', 'Show completed')
          .click();

        cy.contains('button', 'Hide completed')
          .next('.v-list')
          .contains('.task-item', name)
          .should('be.visible');
    });

    it('Unchecks tasks', () => {
        const name = Faker.lorem.sentence();

        cy.createWorkspace(Faker.lorem.sentence()).then(workspace => {
            cy.createTask(workspace.inbox, name).then(task => {
                task.toggle();
                task.save();
            });
        });

        cy.contains('button', 'Show completed')
          .click();

        cy.contains('button', 'Hide completed')
          .next('.v-list')
          .contains('.task-item', name)
          .parent()
          .find('.v-input--checkbox')
          .click();

        cy.contains('.task-item', name)
          .should('be.visible');
    });

});
