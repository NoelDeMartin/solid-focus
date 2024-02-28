import { podUrl, webId } from '@aerogel/cypress';

describe('Cloud', () => {

    beforeEach(() => {
        cy.solidReset();
        cy.visit('/');
    });

    it('Syncs updated tasks', () => {
        // Arrange
        cy.ariaInput('Login url').type(`${webId()}{enter}`);
        cy.solidLogin();
        cy.ariaInput('Task name').type('Sync updates{enter}');
        cy.dontSee('Loading...');

        cy.intercept('PATCH', podUrl('/main/*')).as('updateTask');

        // Act
        cy.press('Sync updates');

        // Assert
        cy.get('@updateTask.all').should('have.length', 1);

        cy.fixture('sparql/complete-task.sparql').then((sparql) => {
            cy.get('@updateTask').its('response.statusCode').should('eq', 205);
            cy.get('@updateTask').its('request.body').should('be.sparql', sparql);
        });
    });

    it('Migrates local data', () => {
        // Arrange
        cy.intercept('PUT', podUrl('/main/')).as('createContainer');
        cy.intercept('PATCH', podUrl('/main/.meta')).as('createContainerMeta');
        cy.intercept('PATCH', podUrl('/main/*')).as('createTask');

        cy.ariaInput('Task name').type('Onboarding task{enter}');
        cy.ariaLabel('View sync status').click();
        cy.ariaInput('Login url').type(`${webId()}{enter}`);
        cy.solidLogin();

        // Act
        cy.see('Your data is only stored locally, do you want to upload it to the cloud?');
        cy.press('Back up');
        cy.dontSee('Loading...');

        // Assert
        cy.see('Main');
        cy.see('Onboarding task');
        cy.see('Inbox', 'li').within(() => {
            cy.see('(active)');
        });

        cy.get('@createContainer.all').should('have.length', 1);
        cy.get('@createContainerMeta.all').should('have.length', 1);
        cy.get('@createTask.all').should('have.length', 1);

        cy.fixtureWithReplacements('sparql/create-container-meta.sparql', { url: podUrl('/main/'), name: 'Main' }).then(
            (sparql) => {
                cy.get('@createContainerMeta').its('response.statusCode').should('eq', 205);
                cy.get('@createContainerMeta').its('request.body').should('be.sparql', sparql);
            },
        );

        cy.fixtureWithReplacements('sparql/create-task.sparql', { name: 'Onboarding task' }).then((sparql) => {
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
