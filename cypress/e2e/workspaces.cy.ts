describe('Workspaces', () => {

    beforeEach(() => {
        cy.visit('/');

        // Initialize workspace
        cy.press('Get started');
        cy.ariaInput('Task name').type('Onboarding task{enter}');
        cy.ariaLabel('Show lists').click();
    });

    it('Creates workspaces', () => {
        // Act
        cy.switchWorkspace('New workspace');
        cy.ariaInput('Name').type('Study{enter}');

        // Assert
        cy.url().should('equal', `${Cypress.config('baseUrl')}/study`);
        cy.seeActiveWorkspace('Study');
        cy.seeActiveList('Inbox');
    });

    it('Edits workspaces', () => {
        // Act
        cy.ariaLabel('Workspace settings').click({ force: true });
        cy.ariaInput('Name').clear().type('Work{enter}');

        // Assert
        cy.url().should('equal', `${Cypress.config('baseUrl')}/main`);
        cy.seeActiveWorkspace('Work');
        cy.dontSee('Main');
    });

    it('Creates lists', () => {
        // Act
        cy.press('New list');
        cy.ariaInput('Name').type('Groceries{enter}');

        // Assert
        cy.url().should('equal', `${Cypress.config('baseUrl')}/main/groceries`);
        cy.seeActiveList('Groceries');
    });

    it('Edits lists', () => {
        // Arrange
        cy.press('New list');
        cy.ariaInput('Name').type('Groceries{enter}');

        // Act
        cy.ariaLabel('Edit Groceries list').click({ force: true });
        cy.ariaInput('Name').clear().type('Learning{enter}');

        // Assert
        cy.url().should('equal', `${Cypress.config('baseUrl')}/main/groceries`);
        cy.seeActiveList('Learning');
        cy.dontSee('Groceries');
    });

});
