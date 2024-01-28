describe('Onboarding', () => {

    beforeEach(() => cy.visit('/'));

    it('Creates a new workspace', () => {
        // Arrange
        cy.see('Solid Focus');

        // Act
        cy.ariaInput('Task name').type('Start being more focused{enter}');

        // Assert
        cy.url().should('equal', `${Cypress.config('baseUrl')}/main`);
        cy.see('Start being more focused');
        cy.see('Main');
        cy.see('Inbox', 'li').within(() => {
            cy.see('(active)');
        });
    });

});
