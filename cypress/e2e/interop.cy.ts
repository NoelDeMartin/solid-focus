import { podUrl, webId } from '@aerogel/cypress';

describe('Interoperability', () => {

    beforeEach(() => {
        cy.visit('/');
        cy.solidReset();
    });

    it('Works with legacy schemas', () => {
        // Arrange
        cy.solidCreateContainer('/tasks/', 'Tasks');
        cy.solidUpdateDocument('/tasks/.meta', 'sparql/prepare-legacy-container.sparql', { url: podUrl('/tasks/') });
        cy.solidCreateDocument('/tasks/legacy-task', 'turtle/legacy-task.ttl');
        cy.solidUpdateDocument('/profile/card', 'sparql/prepare-legacy-profile.sparql');

        cy.intercept('PATCH', podUrl('/tasks/legacy-task')).as('updateTask');
        cy.intercept('PATCH', podUrl('/tasks/!(legacy-task*)')).as('createTask');

        // Act - Log in
        cy.press('Log in');
        cy.ariaInput('Login url').type(`${webId()}{enter}`);
        cy.solidLogin();
        cy.waitSync();

        // Assert - Log in
        cy.press('Completed');
        cy.see('Learn Solid');
        cy.contains('Important').should('exist');
        cy.ariaLabel('Select task \\"Learn Solid\\"').click();
        cy.contains('This was created a long time ago').should('exist');
        cy.contains('Due on Jan 1, 2019').should('exist');
        cy.contains('Completed on Dec 25, 2018').should('exist');

        cy.get('@updateTask.all').should('have.length', 1);
        cy.fixture('sparql/update-legacy-task-1.sparql').then((sparql) => {
            cy.get('@updateTask.1').its('response.statusCode').should('eq', 205);
            cy.get('@updateTask.1').its('request.body').should('be.sparql', sparql);
        });

        // Act - Toggle important
        cy.ariaLabel('Remove important').click();
        cy.waitSync();

        // Assert - Toggle important
        cy.get('@updateTask.all').should('have.length', 2);
        cy.fixture('sparql/update-legacy-task-2.sparql').then((sparql) => {
            cy.get('@updateTask.2').its('response.statusCode').should('eq', 205);
            cy.get('@updateTask.2').its('request.body').should('be.sparql', sparql);
        });

        // Act - Create task
        cy.ariaInput('Task name').type('Rebuild app{enter}');
        cy.waitSync();

        // Assert - Create task
        cy.get('@createTask.all').should('have.length', 1);
        cy.fixture('sparql/create-legacy-task.sparql').then((sparql) => {
            cy.get('@createTask.1').its('response.statusCode').should('eq', 201);
            cy.get('@createTask.1').its('request.body').should('be.sparql', sparql);
        });

        // Act - Reload
        cy.ariaLabel('Open account status').click();
        cy.press('Advanced options', 'summary');
        cy.press('Reconnect on startup');
        cy.get('body').type('{esc}');
        cy.reload();

        // Assert - Reload
        cy.see('Learn Solid');
        cy.see('Rebuild app');
        cy.contains('Important').should('not.exist');
    });

});
