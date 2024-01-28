describe('Workspaces', () => {

    beforeEach(() => {
        cy.visit('/');

        // Initialize workspace
        cy.ariaInput('Task name').type('Onboarding task{enter}');
    });

    it('Creates workspaces', () => {
        // Act
        cy.ariaLabel('Select workspace').within(() => {
            cy.get('button').click();
        });
        cy.press('Add new', 'li');
        cy.ariaInput('Workspace name').type('Study{enter}');

        // Assert
        cy.url().should('equal', `${Cypress.config('baseUrl')}/study`);
        cy.see('Study');
        cy.see('Inbox', 'li').within(() => {
            cy.see('(active)');
        });
    });

    it('Creates lists', () => {
        // Act
        cy.press('Add new');
        cy.ariaInput('List name').type('Groceries{enter}');

        // Assert
        cy.url().should('equal', `${Cypress.config('baseUrl')}/main/groceries`);
        cy.see('Groceries', 'li').within(() => {
            cy.see('(active)');
        });
    });

});
