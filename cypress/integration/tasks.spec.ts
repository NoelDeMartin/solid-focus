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

    it('Supports markdown for task names', () => {
        cy.createWorkspace(Faker.lorem.sentence());

        cy.get('input')
          .type('Tasks support **bold**, *italic* and any `markdown` syntax.')
          .type('{enter}');

        cy.contains('.task-item strong', 'bold').should('be.visible');
        cy.contains('.task-item em', 'italic').should('be.visible');
        cy.contains('.task-item code', 'markdown').should('be.visible');
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

        cy.get('[placeholder="Description"]')
          .type(description);

        cy.get('#app-navigation-sidepanel')
          .contains('button', 'Save')
          .click();

        cy.get('#app-navigation-sidepanel')
          .contains(description)
          .should('be.visible');
    });

    it('Supports markdown for task descriptions', () => {
        const name = Faker.lorem.sentence();

        cy.createWorkspace(Faker.lorem.sentence()).then(workspace => {
            cy.createTask(workspace.inbox, name);
        });

        cy.contains('.task-item', name)
          .click();

        cy.get('#app-navigation-sidepanel')
          .contains('button', 'Edit')
          .click();

        cy.get('[placeholder="Description"]')
          .type('Descriptions also support markdown. Look at this list:')
          .type('{enter}')
          .type('- Item 1')
          .type('{enter}')
          .type('- Item 2')
          .type('{enter}')
          .type('- Item 3');

        cy.get('#app-navigation-sidepanel')
          .contains('button', 'Save')
          .click();

        cy.contains('#app-navigation-sidepanel ul li', 'Item 1').should('be.visible');
        cy.contains('#app-navigation-sidepanel ul li', 'Item 2').should('be.visible');
        cy.contains('#app-navigation-sidepanel ul li', 'Item 3').should('be.visible');
    });

    it('Schedules tasks', () => {
        const name = Faker.lorem.sentence();

        cy.createWorkspace(Faker.lorem.sentence()).then(workspace => {
            cy.createTask(workspace.inbox, name);
        });

        cy.contains('.task-item', name)
          .click();

        cy.get('#app-navigation-sidepanel')
          .contains('button', 'Edit')
          .click();

        cy.get('[placeholder="Due date"]')
          .click();

        cy.get('.v-btn.accent')
          .click();

        cy.get('#app-navigation-sidepanel')
          .contains('button', 'Save')
          .click();

        cy.contains('.task-item', name)
          .contains('Today')
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
