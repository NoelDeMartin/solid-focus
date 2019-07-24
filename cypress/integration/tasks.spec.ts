import Faker from 'faker';

describe('Tasks', () => {

    beforeEach(() => {
        cy.visit('/');
        cy.start();
        cy.login();
    });

    it('Creates tasks', () => {
        const name = Faker.lorem.sentence();

        cy.createWorkspace(Faker.lorem.sentence());

        cy.spyEngine();

        cy.get('input').type(name).type('{enter}');

        cy.contains('.task-item', name).should('be.visible');

        cy.engineSpiesExpectations({
            create: method => expect(method).to.have.been.calledWith(
                Cypress.sinon.match.string,
                {
                    '@id': Cypress.sinon.match.any,
                    '@type': [
                        { '@id': 'http://purl.org/vocab/lifecycle/schema#Task' },
                        { '@id': 'https://www.w3.org/ns/prov#Activity' },
                        { '@id': 'http://www.w3.org/ns/ldp#Resource' },
                    ],
                    'http://purl.org/vocab/lifecycle/schema#name': name,
                    'http://purl.org/dc/terms/created': Cypress.sinon.match.any,
                    'http://purl.org/dc/terms/modified': Cypress.sinon.match.any,
                },
                Cypress.sinon.match.string,
            ),
        });
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

        cy.engineSpiesExpectations({
            update: method => expect(method).to.have.been.calledWith(
                Cypress.sinon.match.string,
                taskUrl,
                {
                    'http://purl.org/dc/terms/modified': Cypress.sinon.match.any,
                    'http://purl.org/net/provenance/ns#completedAt': Cypress.sinon.match.any,
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
          .parent()
          .find('.v-input--checkbox')
          .click();

        cy.contains('.task-item', name)
          .should('be.visible');

        cy.engineSpiesExpectations({
            update: method => expect(method).to.have.been.calledWith(
                Cypress.sinon.match.string,
                taskUrl,
                { 'http://purl.org/dc/terms/modified': Cypress.sinon.match.any },
                ['http://purl.org/net/provenance/ns#completedAt'],
            ),
        });
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

        cy.engineSpiesExpectations({
            update: method => expect(method).to.have.been.calledWith(
                Cypress.sinon.match.string,
                taskUrl,
                {
                    'http://purl.org/vocab/lifecycle/schema#name': newName,
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

        cy.engineSpiesExpectations({
            update: method => expect(method).to.have.been.calledWith(
                Cypress.sinon.match.string,
                taskUrl,
                {
                    'http://purl.org/dc/terms/description': description,
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

        let taskUrl: string;

        cy.createWorkspace(Faker.lorem.sentence()).then(workspace => {
            cy.createTask(workspace.inbox, name).then(task => taskUrl = task.url);
        });

        cy.spyEngine();

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

        cy.engineSpiesExpectations({
            update: method => expect(method).to.have.been.calledWith(
                Cypress.sinon.match.string,
                taskUrl,
                {
                    'http://purl.org/dc/terms/date': Cypress.sinon.match.any,
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

        cy.get('#app-navigation-sidepanel')
          .contains('button', 'Edit')
          .click();

        cy.get('#app-navigation-sidepanel')
          .find('button[title="Remove task"]')
          .click();

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
