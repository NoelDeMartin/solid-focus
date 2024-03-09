import { podUrl, webId } from '@aerogel/cypress';
import { uuid } from '@noeldemartin/utils';

describe('Onboarding', () => {

    beforeEach(() => {
        cy.solidReset();
        cy.visit('/');
    });

    it('Starts offline', () => {
        // Arrange
        cy.see('Solid Focus');

        // Act
        cy.ariaInput('Task name').type('Start being more focused{enter}');

        // Assert
        cy.url().should('equal', `${Cypress.config('baseUrl')}/main`);
        cy.see('Start being more focused');
        cy.seeActiveWorkspace('Main');
        cy.seeActiveList('Inbox');
    });

    it('Signs up', () => {
        // Arrange
        cy.intercept('PUT', podUrl('/main/')).as('createContainer');
        cy.intercept('PATCH', podUrl('/main/.meta')).as('createContainerMeta');
        cy.intercept('PATCH', podUrl('/main/*')).as('createTask');

        // Act
        cy.ariaInput('Login url').type(`${webId()}{enter}`);
        cy.solidLogin();
        cy.ariaInput('Task name').type('Cook Ramen{enter}');
        cy.waitSync();

        // Assert
        cy.url().should('equal', `${Cypress.config('baseUrl')}/main`);
        cy.seeActiveWorkspace('Main');
        cy.see('Cook Ramen');
        cy.seeActiveList('Inbox');

        cy.reload();
        cy.seeActiveWorkspace('Main');
        cy.see('Cook Ramen');
        cy.seeActiveList('Inbox');

        cy.get('@createContainer.all').should('have.length', 1);
        cy.get('@createContainerMeta.all').should('have.length', 1);
        cy.get('@createTask.all').should('have.length', 1);

        cy.fixtureWithReplacements('sparql/create-container-meta.sparql', { url: podUrl('/main/'), name: 'Main' }).then(
            (sparql) => {
                cy.get('@createContainerMeta').its('response.statusCode').should('eq', 205);
                cy.get('@createContainerMeta').its('request.body').should('be.sparql', sparql);
            },
        );

        cy.fixtureWithReplacements('sparql/create-task.sparql', { name: 'Cook Ramen' }).then((sparql) => {
            cy.get('@createTask').its('response.statusCode').should('eq', 201);
            cy.get('@createTask').its('request.body').should('be.sparql', sparql);
        });
    });

    it('Logs in', () => {
        // Arrange
        cy.solidCreateContainer('/work/', 'Work');
        cy.solidCreateContainer('/household/', 'Household');
        cy.solidCreateContainer('/household/groceries/', 'Groceries');
        cy.solidCreateDocument('/settings/privateTypeIndex', '<> a <http://www.w3.org/ns/solid/terms#TypeIndex> .');
        cy.solidUpdateDocument('/settings/privateTypeIndex', 'sparql/register-workspace.sparql', {
            containerUrl: podUrl('/work/'),
        });
        cy.solidUpdateDocument('/settings/privateTypeIndex', 'sparql/register-workspace.sparql', {
            containerUrl: podUrl('/household/'),
        });
        cy.solidUpdateDocument('/profile/card', 'sparql/declare-type-index.sparql');
        cy.solidCreateDocument('/household/tomatoes', 'turtle/task.ttl', { name: 'Tomatoes' });

        // Act
        cy.ariaInput('Login url').type(`${webId()}{enter}`);
        cy.solidLogin();

        // Assert
        cy.see('Syncing');

        cy.url().should('equal', `${Cypress.config('baseUrl')}/household`);
        cy.seeActiveWorkspace('Household');
        cy.seeActiveList('Inbox');
        cy.see('Tomatoes');
        cy.see('Groceries');

        cy.press('Household');
        cy.see('Work');
    });

});
