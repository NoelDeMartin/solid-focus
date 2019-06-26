import Faker from 'faker';

describe('Tasks', () => {

    beforeEach(() => {
        cy.visit('/');
        cy.start();
        cy.login();
    });

    it('Creates a task', () => {
        const name = Faker.lorem.sentence();

        cy.createWorkspace(Faker.lorem.sentence());

        cy.get('input').type(name).type('{enter}');

        cy.contains('.task-item', name).should('be.visible');
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

    it('Edits task names', () => {
        const oldName = Faker.lorem.sentence();
        const newName = Faker.lorem.sentence();

        cy.createWorkspace(Faker.lorem.sentence()).then(workspace => {
            cy.createTask(workspace.inbox, oldName);
        });

        cy.contains('.task-item', oldName)
          .click();

        cy.get('#app-navigation-sidepanel')
          .contains('button', 'Edit')
          .click();

        cy.get('#app-navigation-sidepanel')
          .find('textarea')
          .first()
          .clear()
          .type(newName);

        cy.get('#app-navigation-sidepanel')
          .contains('button', 'Save')
          .click();

        cy.contains('.task-item', newName)
          .should('be.visible');
    });

    it('Edits task descriptions', () => {
        const name = Faker.lorem.sentence();
        const description = Faker.lorem.paragraph();

        cy.createWorkspace(Faker.lorem.sentence()).then(workspace => {
            cy.createTask(workspace.inbox, name);
        });

        cy.contains('.task-item', name)
          .click();

        cy.get('#app-navigation-sidepanel')
          .contains('button', 'Edit')
          .click();

        cy.contains('label', 'Description')
          .next('textarea')
          .type(description);

        cy.get('#app-navigation-sidepanel')
          .contains('button', 'Save')
          .click();

        cy.get('#app-navigation-sidepanel')
          .contains(description)
          .should('be.visible');
    });

    it('Deletes tasks', () => {
        const name = Faker.lorem.sentence();

        cy.createWorkspace(Faker.lorem.sentence()).then(workspace => {
            cy.createTask(workspace.inbox, name);
        });

        cy.contains('.task-item', name)
          .click();

        cy.get('#app-navigation-sidepanel')
          .contains('button', 'Remove')
          .click();

        cy.contains('Delete').click();

        cy.contains('.task-item', name)
          .should('not.be.visible');
    });

});
