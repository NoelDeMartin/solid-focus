import { podUrl, webId } from '@aerogel/cypress';

describe('Interoperability', () => {

    beforeEach(() => {
        cy.visit('/');
        cy.solidReset();
    });

    it('Works with legacy tasks', () => {
        // Arrange
        cy.solidCreateContainer('/tasks/', 'Tasks');
        cy.solidUpdateDocument('/tasks/.meta', 'sparql/prepare-legacy-container.sparql', { url: podUrl('/tasks/') });
        cy.solidCreateDocument('/tasks/legacy-task', 'turtle/legacy-task.ttl');
        cy.solidUpdateDocument('/profile/card', 'sparql/prepare-legacy-profile.sparql');

        // Act
        cy.press('Log in');
        cy.ariaInput('Login url').type(`${webId()}{enter}`);
        cy.solidLogin();
        cy.waitSync();

        // Assert
        cy.press('Completed');
        cy.see('Learn Solid');
    });

});
