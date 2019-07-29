import Faker from 'faker';

describe('Workspaces', () => {

    beforeEach(() => {
        cy.visit('/');
        cy.start();
        cy.login();
    });

    it('Creates workspaces', () => {
        const name = Faker.lorem.sentence();

        cy.spyEngine();

        cy.get('[title="Create new workspace"]').click();

        cy.get('input').type(name).type('{enter}');

        cy.contains('#app-navigation-drawer', name).should('be.visible');
        cy.contains('.v-toolbar', 'Inbox').should('be.visible');

        cy.engineSpiesExpectations({
            create: method => expect(method).to.have.been.calledWith(
                Cypress.sinon.match.string,
                {
                    '@id': Cypress.sinon.match.any,
                    '@type': [
                        { '@id': 'http://purl.org/vocab/lifecycle/schema#TaskGroup' },
                        { '@id': 'http://www.w3.org/ns/ldp#Resource' },
                        { '@id': 'http://www.w3.org/ns/ldp#Container' },
                    ],
                    'http://www.w3.org/2000/01/rdf-schema#label': name,
                    'http://purl.org/dc/terms/created': Cypress.sinon.match.any,
                    'http://purl.org/dc/terms/modified': Cypress.sinon.match.any,
                },
                Cypress.sinon.match.string,
            ),
            readOne: method => expect(method).to.have.been.calledWith(
                Cypress.sinon.match.string,
                Cypress.sinon.match.string,
            ),
        });
    });

    it('Edits workspaces', () => {
        const name = Faker.lorem.sentence();
        const newName = Faker.lorem.sentence();

        let workspaceUrl: string;

        cy.createWorkspace(name).then(workspace => workspaceUrl = workspace.url);

        cy.spyEngine();

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

        cy.engineSpiesExpectations({
            update: method => expect(method).to.have.been.calledWith(
                Cypress.sinon.match.string,
                workspaceUrl,
                {
                    'http://www.w3.org/2000/01/rdf-schema#label': newName,
                    'http://purl.org/dc/terms/modified': Cypress.sinon.match.any,
                },
                [],
            ),
        });
    });

    it('Deletes workspaces', () => {
        const name = Faker.lorem.sentence();

        let workspaceUrl: string;

        cy.createWorkspace(name).then(workspace => workspaceUrl = workspace.url);

        cy.spyEngine();

        cy.get('#app-navigation-drawer [title="Manage workspaces"]')
          .click();

        cy.contains('.v-menu__content .v-list__tile', name)
          .children('.v-list__tile__action')
          .then($el => $el.removeClass('reveal-on-hover'))
          .children('button[title="Edit workspace"]')
          .click();

        cy.get('.v-dialog')
          .find('button[title="Remove workspace"]')
          .click();

        cy.contains('Delete').click();

        cy.contains('#app-navigation-drawer', name)
          .should('not.be.visible');

        cy.engineSpiesExpectations({
            delete: method => expect(method).to.have.been.calledWith(
                Cypress.sinon.match.string,
                workspaceUrl,
            ),
        });
    });

    it('Creates lists', () => {
        const name = Faker.lorem.sentence();

        let workspaceUrl: string;

        cy.createWorkspace(Faker.lorem.sentence()).then(workspace => workspaceUrl = workspace.url);

        cy.spyEngine();

        cy.contains('a', 'Create list').click();

        cy.get('.v-dialog').within(() => {
            cy.get('input').type(name).type('{enter}');
        });

        cy.contains('#app-navigation-drawer a', name).should('be.visible');
        cy.contains('.v-toolbar', name).should('be.visible');

        cy.engineSpiesExpectations({
            create: method => expect(method).to.have.been.calledWith(
                workspaceUrl,
                {
                    '@id': Cypress.sinon.match.any,
                    '@type': [
                        { '@id': 'http://purl.org/vocab/lifecycle/schema#TaskGroup' },
                        { '@id': 'http://www.w3.org/ns/ldp#Resource' },
                        { '@id': 'http://www.w3.org/ns/ldp#Container' },
                    ],
                    'http://www.w3.org/2000/01/rdf-schema#label': name,
                    'http://purl.org/dc/terms/created': Cypress.sinon.match.any,
                    'http://purl.org/dc/terms/modified': Cypress.sinon.match.any,
                },
                Cypress.sinon.match.string,
            ),
        });
    });

    it('Edits lists', () => {
        const name = Faker.lorem.sentence();
        const newName = Faker.lorem.sentence();

        let listUrl: string;

        cy.createWorkspace(Faker.lorem.sentence()).then(workspace => {
            cy.createList(workspace, name).then(list => listUrl = list.url);
        });

        cy.spyEngine();

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

        cy.engineSpiesExpectations({
            update: method => expect(method).to.have.been.calledWith(
                Cypress.sinon.match.string,
                listUrl,
                {
                    'http://www.w3.org/2000/01/rdf-schema#label': newName,
                    'http://purl.org/dc/terms/modified': Cypress.sinon.match.any,
                },
                [],
            ),
        });
    });

    it('Deletes lists', () => {
        const name = Faker.lorem.sentence();

        let listUrl: string;

        cy.createWorkspace(Faker.lorem.sentence()).then(workspace => {
            cy.createList(workspace, name).then(list => listUrl = list.url);
        });

        cy.spyEngine();

        cy.contains('#app-navigation-drawer .v-list__tile', name)
          .children('.v-list__tile__action')
          .then($el => $el.removeClass('reveal-on-hover'));

        cy.contains('#app-navigation-drawer .v-list__tile', name)
          .get('button[title="Edit list"]')
          .click();

        cy.get('.v-dialog')
          .find('button[title="Remove list"]')
          .click();

        cy.contains('Delete').click();

        cy.contains('#app-navigation-drawer', name)
          .should('not.be.visible');

        cy.engineSpiesExpectations({
            delete: method => expect(method).to.have.been.calledWith(
                Cypress.sinon.match.string,
                listUrl,
            ),
        });
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
