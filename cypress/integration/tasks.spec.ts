import Faker from 'faker';

import TestingEngine from '@cy/support/engines/TestingEngine';

describe('Tasks', () => {

    beforeEach(() => {
        cy.visit('/');
        cy.start();
        cy.login();
    });

    it('Creates tasks', () => {
        const name = Faker.lorem.sentence();

        let workspaceUrl: string;

        cy.createWorkspace(Faker.lorem.sentence()).then(workspace => workspaceUrl = workspace.url);

        cy.spyEngine();

        cy.get('input').type(name).type('{enter}');

        cy.contains('.task-item', name).should('be.visible');

        cy.engineSpiesExpectations({
            create: method => expect(method).to.have.been.calledWith(
                workspaceUrl,
                {
                    '@id': Cypress.sinon.match.any,
                    '@type': [
                        { '@id': 'http://purl.org/vocab/lifecycle/schema#Task' },
                        { '@id': 'http://www.w3.org/ns/ldp#Resource' },
                    ],
                    'http://www.w3.org/2000/01/rdf-schema#label': name,
                    'http://purl.org/dc/terms/created': Cypress.sinon.match.any,
                    'http://purl.org/dc/terms/modified': Cypress.sinon.match.any,
                },
                Cypress.sinon.match.string,
            ),
            update: method => expect(method).to.have.been.calledWith(
                Cypress.sinon.match.string,
                workspaceUrl,
                {
                    'http://purl.org/vocab/lifecycle/schema#task': {
                        '@id': Cypress.sinon.match.string,
                    },
                    'http://purl.org/dc/terms/modified': Cypress.sinon.match.any,
                },
                [],
            ),
        });
    });

    it('Creates a second task', () => {
        const name = Faker.lorem.sentence();

        let workspaceUrl: string;
        let taskUrl: string;

        cy.createWorkspace(Faker.lorem.sentence()).then(workspace => {
            workspaceUrl = workspace.url;

            cy.createTask(workspace.inbox, Faker.lorem.sentence()).then(task => taskUrl = task.url);
        });

        cy.spyEngine();

        cy.get('input[type="text"]').type(name).type('{enter}');

        cy.contains('.task-item', name).should('be.visible');

        cy.engineSpiesExpectations({
            create: method => expect(method).to.have.been.calledWith(
                workspaceUrl,
                {
                    '@id': Cypress.sinon.match.any,
                    '@type': [
                        { '@id': 'http://purl.org/vocab/lifecycle/schema#Task' },
                        { '@id': 'http://www.w3.org/ns/ldp#Resource' },
                    ],
                    'http://www.w3.org/2000/01/rdf-schema#label': name,
                    'http://purl.org/dc/terms/created': Cypress.sinon.match.any,
                    'http://purl.org/dc/terms/modified': Cypress.sinon.match.any,
                },
                Cypress.sinon.match.string,
            ),
            update: method => expect(method).to.have.been.calledWith(
                Cypress.sinon.match.string,
                workspaceUrl,
                {
                    'http://purl.org/vocab/lifecycle/schema#task': [
                        { '@id': taskUrl },
                        { '@id': Cypress.sinon.match.string },
                    ],
                    'http://purl.org/dc/terms/modified': Cypress.sinon.match.any,
                },
                [],
            ),
        });
    });

    it('Shows a progress circle when creating a task takes too long', () => {
        cy.createWorkspace(Faker.lorem.sentence());

        cy.get<TestingEngine>('@soukaiEngine')
          .then(engine => engine.setDelay(8000));

        cy.get('input')
          .type(Faker.lorem.sentence())
          .type('{enter}');

        cy.get('.task-item .v-progress-circular').should('be.visible');
    });

    it('Shows error messages', () => {
        const errorMessage = Faker.lorem.sentence();

        cy.createWorkspace(Faker.lorem.sentence());

        cy.get<TestingEngine>('@soukaiEngine')
          .then(engine => engine.setError(new Error(errorMessage)));

        cy.get('input')
          .type(Faker.lorem.sentence())
          .type('{enter}');

        cy.contains('.v-dialog', errorMessage).should('be.visible');
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

        let taskUrl: string;

        cy.createWorkspace(Faker.lorem.sentence()).then(workspace => {
            cy.createTask(workspace.inbox, name).then(task => taskUrl = task.url);
        });

        cy.spyEngine();

        cy.contains('.task-item', name)
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

        cy.engineSpiesExpectations({
            update: method => expect(method).to.have.been.calledWith(
                Cypress.sinon.match.string,
                taskUrl,
                {
                    'http://purl.org/dc/terms/modified': Cypress.sinon.match.any,
                    'http://www.w3.org/2002/12/cal/ical#completed': Cypress.sinon.match.any,
                },
                [],
            ),
        });
    });

    it('Unchecks tasks', () => {
        const name = Faker.lorem.sentence();

        let taskUrl: string;

        cy.createWorkspace(Faker.lorem.sentence()).then(workspace => {
            cy.createTask(workspace.inbox, name).then(task => {
                taskUrl = task.url;

                task.toggle();
                task.save();
            });
        });

        cy.spyEngine();

        cy.contains('button', 'Show completed')
          .click();

        cy.contains('button', 'Hide completed')
          .next('.v-list')
          .contains('.task-item', name)
          .find('.v-input--checkbox')
          .click();

        cy.contains('.task-item', name)
          .should('be.visible');

        cy.engineSpiesExpectations({
            update: method => expect(method).to.have.been.calledWith(
                Cypress.sinon.match.string,
                taskUrl,
                { 'http://purl.org/dc/terms/modified': Cypress.sinon.match.any },
                ['http://www.w3.org/2002/12/cal/ical#completed'],
            ),
        });
    });

    it('Shows a snackbar when updating a task takes too long', () => {
        const names = [
            Faker.lorem.sentence(),
            Faker.lorem.sentence(),
        ];

        cy.createWorkspace(Faker.lorem.sentence()).then(workspace => {
            for (const name of names) {
                cy.createTask(workspace.inbox, name);
            }
        });

        cy.get<TestingEngine>('@soukaiEngine')
          .then(engine => engine.setDelay(8000));

        for (const name of names) {
            cy.contains('.task-item', name)
              .find('.v-input--checkbox')
              .click();

            cy.wait(500);
        }

        cy.contains('.v-snack', 'Saving changes...');

        for (let count = 2; count <= names.length; count++) {
            cy.contains('.v-snack', `Saving ${count} changes...`).should('be.visible');
        }
    });

    it('Edits task names', () => {
        const oldName = Faker.lorem.sentence();
        const newName = Faker.lorem.sentence();

        let taskUrl: string;

        cy.createWorkspace(Faker.lorem.sentence()).then(workspace => {
            cy.createTask(workspace.inbox, oldName).then(task => taskUrl = task.url);
        });

        cy.spyEngine();

        cy.contains('.task-item', oldName)
          .click();

        cy.get('#app-navigation-sidepanel button[title="Show actions menu"]').click();
        cy.contains('Edit').click();

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

        cy.engineSpiesExpectations({
            update: method => expect(method).to.have.been.calledWith(
                Cypress.sinon.match.string,
                taskUrl,
                {
                    'http://www.w3.org/2000/01/rdf-schema#label': newName,
                    'http://purl.org/dc/terms/modified': Cypress.sinon.match.any,
                },
                [],
            ),
        });
    });

    it('Edits task descriptions', () => {
        const name = Faker.lorem.sentence();
        const description = Faker.lorem.paragraph();

        let taskUrl: string;

        cy.createWorkspace(Faker.lorem.sentence()).then(workspace => {
            cy.createTask(workspace.inbox, name).then(task => taskUrl = task.url);
        });

        cy.spyEngine();

        cy.contains('.task-item', name)
          .click();

        cy.get('#app-navigation-sidepanel button[title="Show actions menu"]').click();
        cy.contains('Edit').click();

        cy.get('[placeholder="Description"]')
          .type(description);

        cy.get('#app-navigation-sidepanel')
          .contains('button', 'Save')
          .click();

        cy.get('#app-navigation-sidepanel')
          .contains(description)
          .should('be.visible');

        cy.engineSpiesExpectations({
            update: method => expect(method).to.have.been.calledWith(
                Cypress.sinon.match.string,
                taskUrl,
                {
                    'http://www.w3.org/2000/01/rdf-schema#comment': description,
                    'http://purl.org/dc/terms/modified': Cypress.sinon.match.any,
                },
                [],
            ),
        });
    });

    it('Supports markdown for task descriptions', () => {
        const name = Faker.lorem.sentence();

        cy.createWorkspace(Faker.lorem.sentence()).then(workspace => {
            cy.createTask(workspace.inbox, name);
        });

        cy.contains('.task-item', name)
          .click();

        cy.get('#app-navigation-sidepanel button[title="Show actions menu"]').click();
        cy.contains('Edit').click();

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

        let taskUrl: string;

        cy.createWorkspace(Faker.lorem.sentence()).then(workspace => {
            cy.createTask(workspace.inbox, name).then(task => taskUrl = task.url);
        });

        cy.spyEngine();

        cy.contains('.task-item', name)
          .click();

        cy.get('#app-navigation-sidepanel button[title="Show actions menu"]').click();
        cy.contains('Edit').click();

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

        cy.engineSpiesExpectations({
            update: method => expect(method).to.have.been.calledWith(
                Cypress.sinon.match.string,
                taskUrl,
                {
                    'http://www.w3.org/2002/12/cal/ical#due': Cypress.sinon.match.any,
                    'http://purl.org/dc/terms/modified': Cypress.sinon.match.any,
                },
                [],
            ),
        });
    });

    it('Deletes tasks', () => {
        const name = Faker.lorem.sentence();

        let taskUrl: string;

        cy.createWorkspace(Faker.lorem.sentence()).then(workspace => {
            cy.createTask(workspace.inbox, name).then(task => taskUrl = task.url);
        });

        cy.spyEngine();

        cy.contains('.task-item', name)
          .click();

        cy.get('#app-navigation-sidepanel button[title="Show actions menu"]').click();
        cy.contains('Remove').click();

        cy.contains('Delete').click();

        cy.contains('.task-item', name)
          .should('not.be.visible');

        cy.engineSpiesExpectations({
            delete: method => expect(method).to.have.been.calledWith(
                Cypress.sinon.match.string,
                taskUrl,
            ),
        });
    });

});
