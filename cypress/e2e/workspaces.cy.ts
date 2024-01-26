describe('Workspaces', () => {

    beforeEach(() => {
        cy.visit('/');
        cy.ariaInput('Task name').type('...{enter}');
    });

    it('Creates lists', () => {
        cy.press('Add new');
        cy.ariaInput('List name').type('Groceries{enter}');
        cy.see('Groceries', 'li').within(() => {
            cy.see('(active)');
        });
    });

});
