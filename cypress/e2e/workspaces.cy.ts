describe('Workspaces', () => {

    beforeEach(() => {
        cy.visit('/');
        cy.ariaInput('Task name').type('...{enter}');
    });

    it('Loads default workspace', () => {
        cy.visit('/');
        cy.see('Main');
        cy.see('Inbox (active)');
    });

    it('Not found', () => {
        cy.visit('/this-does-not-exist');
        cy.see('Could not find \'this-does-not-exist\' workspace');
    });

});
