import { podUrl, webId } from '@aerogel/cypress';

describe('Onboarding', () => {

    beforeEach(() => {
        cy.solidReset();
        cy.visit('/');
    });

    it('Starts offline', () => {
        // Arrange
        cy.see('Forget with confidence');

        // Act
        cy.press('Get started');
        cy.ariaInput('Task name').type('Start being more focused{enter}');
        cy.ariaLabel('Show lists').click();

        // Assert
        cy.url().should('equal', `${Cypress.config('baseUrl')}/main`);
        cy.see('Start being more focused');
        cy.seeActiveWorkspace('Main');
        cy.seeActiveList('Inbox');
    });

    it('Signs up', () => {
        // Arrange
        cy.intercept('PUT', podUrl('/tasks/main/')).as('createContainer');
        cy.intercept('PATCH', podUrl('/tasks/main/.meta')).as('createContainerMeta');
        cy.intercept('PATCH', podUrl('/tasks/main/*')).as('createTask');

        // Act
        cy.press('Log in');
        cy.ariaInput('Login url').type(`${webId()}{enter}`);
        cy.solidLogin();
        cy.ariaInput('Task name').type('Cook Ramen{enter}');
        cy.waitSync();
        cy.ariaLabel('Show lists').click();

        // Assert
        cy.url().should('equal', `${Cypress.config('baseUrl')}/main`);
        cy.seeActiveWorkspace('Main');
        cy.see('Cook Ramen');
        cy.seeActiveList('Inbox');

        cy.reload();
        cy.solidAuthorize();
        cy.seeActiveWorkspace('Main');
        cy.see('Cook Ramen');
        cy.seeActiveList('Inbox');

        cy.get('@createContainer.all').should('have.length', 1);
        cy.get('@createContainerMeta.all').should('have.length', 1);
        cy.get('@createTask.all').should('have.length', 1);

        cy.fixtureWithReplacements('sparql/create-container-meta.sparql', {
            url: podUrl('/tasks/main/'),
            name: 'Main',
        }).then((sparql) => {
            cy.get('@createContainerMeta').its('response.statusCode').should('eq', 205);
            cy.get('@createContainerMeta').its('request.body').should('be.sparql', sparql);
        });

        cy.fixtureWithReplacements('sparql/create-task.sparql', { name: 'Cook Ramen' }).then((sparql) => {
            cy.get('@createTask').its('response.statusCode').should('eq', 201);
            cy.get('@createTask').its('request.body').should('be.sparql', sparql);
        });

        cy.fixtureWithReplacements('turtle/type-index.ttl', { containerUrl: '../tasks/main/' }).then((expected) => {
            cy.solidReadDocument('/settings/privateTypeIndex').then((actual) => {
                cy.wrap(actual).should('be.turtle', expected);
            });
        });
    });

    it('Signs up using advanced options', () => {
        // Arrange
        cy.intercept('PUT', podUrl('/work/')).as('createContainer');
        cy.intercept('PATCH', podUrl('/work/.meta')).as('createContainerMeta');
        cy.intercept('PATCH', podUrl('/work/*')).as('createTask');

        // Act
        cy.press('Log in');
        cy.ariaInput('Login url').type(`${webId()}{enter}`);
        cy.solidLogin();
        cy.press('Advanced options', 'summary');
        cy.ariaInput('Task name').type('Reply to support emails');
        cy.ariaInput('Workspace name').clear().type('Work');
        cy.ariaInput('Workspace url').clear().type(podUrl('/work/'));
        cy.press('Continue');
        cy.waitSync();
        cy.ariaLabel('Show lists').click();

        // Assert
        cy.url().should('equal', `${Cypress.config('baseUrl')}/work`);
        cy.seeActiveWorkspace('Work');
        cy.see('Reply to support emails');
        cy.seeActiveList('Inbox');

        cy.reload();
        cy.solidAuthorize();
        cy.seeActiveWorkspace('Work');
        cy.see('Reply to support emails');
        cy.seeActiveList('Inbox');

        cy.get('@createContainer.all').should('have.length', 1);
        cy.get('@createContainerMeta.all').should('have.length', 1);
        cy.get('@createTask.all').should('have.length', 1);

        cy.fixtureWithReplacements('sparql/create-container-meta.sparql', {
            url: podUrl('/work/'),
            name: 'Work',
        }).then((sparql) => {
            cy.get('@createContainerMeta').its('response.statusCode').should('eq', 205);
            cy.get('@createContainerMeta').its('request.body').should('be.sparql', sparql);
        });

        cy.fixtureWithReplacements('sparql/create-task.sparql', { name: 'Reply to support emails' }).then((sparql) => {
            cy.get('@createTask').its('response.statusCode').should('eq', 201);
            cy.get('@createTask').its('request.body').should('be.sparql', sparql);
        });

        cy.fixtureWithReplacements('turtle/type-index.ttl', { containerUrl: '../work/' }).then((expected) => {
            cy.solidReadDocument('/settings/privateTypeIndex').then((actual) => {
                cy.wrap(actual).should('be.turtle', expected);
            });
        });
    });

    it('Logs in', () => {
        // Arrange
        cy.solidCreateContainer('/tasks/work/', 'Work');
        cy.solidCreateContainer('/tasks/household/', 'Household');
        cy.solidCreateContainer('/tasks/household/groceries/', 'Groceries');
        cy.solidCreateDocument('/settings/privateTypeIndex', '<> a <http://www.w3.org/ns/solid/terms#TypeIndex> .');
        cy.solidUpdateDocument('/settings/privateTypeIndex', 'sparql/register-workspace.sparql', {
            containerUrl: podUrl('/tasks/work/'),
        });
        cy.solidUpdateDocument('/settings/privateTypeIndex', 'sparql/register-workspace.sparql', {
            containerUrl: podUrl('/tasks/household/'),
        });
        cy.solidUpdateDocument('/profile/card', 'sparql/declare-type-index.sparql');
        cy.solidCreateDocument('/tasks/household/tomatoes', 'turtle/task.ttl', { name: 'Tomatoes' });

        // Act
        cy.press('Log in');
        cy.ariaInput('Login url').type(`${webId()}{enter}`);
        cy.solidLogin();

        // Assert
        cy.see('Synchronization in progress');
        cy.ariaLabel('Show lists').click();

        cy.url().should('equal', `${Cypress.config('baseUrl')}/household`);
        cy.seeActiveWorkspace('Household');
        cy.seeActiveList('Inbox');
        cy.see('Tomatoes');
        cy.see('Groceries');

        cy.press('Household');
        cy.see('Work');
    });

});
