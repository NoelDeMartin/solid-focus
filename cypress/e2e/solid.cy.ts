import { podUrl, webId } from '@aerogel/cypress';

describe('Solid', () => {

    beforeEach(() => {
        cy.solidReset();
        cy.visit('/');
    });

    it('Signs up', () => {
        // Arrange
        cy.intercept('PUT', podUrl('/main/')).as('createContainer');
        cy.intercept('PATCH', podUrl('/main/.meta')).as('createContainerMeta');
        cy.intercept('PATCH', podUrl('/main/*')).as('createTask');

        // Act
        cy.ariaInput('Login url').type(`${webId()}{enter}`);
        cy.solidLogin();
        cy.ariaInput('Workspace name').type('Main{enter}');
        cy.ariaInput('Task name').type('Cook Ramen{enter}');
        cy.waitSync();

        // Assert
        cy.url().should('equal', `${Cypress.config('baseUrl')}/main`);
        cy.see('Main');
        cy.see('Cook Ramen');
        cy.see('Inbox', 'li').within(() => {
            cy.see('(active)');
        });

        cy.reload();
        cy.see('Main');
        cy.see('Cook Ramen');
        cy.see('Inbox', 'li').within(() => {
            cy.see('(active)');
        });

        cy.get('@createContainer.all').should('have.length', 1);
        cy.get('@createContainerMeta.all').should('have.length', 1);
        cy.get('@createTask.all').should('have.length', 1);

        cy.fixtureWithReplacements('create-container-meta.sparql', { url: podUrl('/main/'), name: 'Main' }).then(
            (sparql) => {
                cy.get('@createContainerMeta').its('response.statusCode').should('eq', 205);
                cy.get('@createContainerMeta').its('request.body').should('be.sparql', sparql);
            },
        );

        cy.fixtureWithReplacements('create-task.sparql', { name: 'Cook Ramen' }).then((sparql) => {
            cy.get('@createTask').its('response.statusCode').should('eq', 201);
            cy.get('@createTask').its('request.body').should('be.sparql', sparql);
        });
    });

    it('Postpones migrating local data', () => {
        // Arrange
        cy.ariaInput('Task name').type('Onboarding task{enter}');
        cy.ariaLabel('View sync status').click();
        cy.ariaInput('Login url').type(`${webId()}{enter}`);
        cy.solidLogin();

        // Act
        cy.see('Your data is only stored locally, do you want to upload it to the cloud?');
        cy.press('not now');

        // Assert
        cy.dontSee('Your data is only stored locally, do you want to upload it to the cloud?');
        cy.see('Onboarding task');
        cy.ariaLabel('View sync status').click();
        cy.see('Your data is only stored locally, do you want to upload it to the cloud?');

        cy.reload();
        cy.see('Onboarding task');
    });

});
