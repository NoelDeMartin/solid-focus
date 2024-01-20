describe('Onboarding', () => {

    beforeEach(() => cy.visit('/'));

    it('Creates initial workspace', () => {
        // Arrange
        cy.see('Solid Focus');

        // Act
        cy.ariaInput('Task name').type('Start being more focused{enter}');

        // Assert
        cy.dontSee('Solid Focus');
        cy.see('Main');
        cy.see('Inbox (active)');
        cy.see('Start being more focused');
        cy.url().should('equal', `${Cypress.config('baseUrl')}/main`);
    });

});
