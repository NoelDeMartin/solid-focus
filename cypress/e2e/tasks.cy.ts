describe('Tasks', () => {

    beforeEach(() => {
        cy.visit('/');
        cy.ariaInput('Task name').type('...{enter}');
    });

    it('Creates tasks', () => {
        cy.ariaInput('Task name').type('Cook Ramen{enter}');
        cy.see('Cook Ramen', 'li');

        cy.ariaInput('Task name').type('Eat Ramen{enter}');
        cy.see('Eat Ramen', 'li');
    });

});
