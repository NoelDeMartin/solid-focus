describe('Authentication', () => {

    beforeEach(() => {
        cy.visit('/');
        cy.start();
    });

    it('Logs in offline', () => {
        cy.contains('Login Offline').click();

        cy.contains("You don't have any workspace, create one!");
    });

});
