describe('Authentication', () => {

    it('Logs in offline', () => {
        cy.visit('/');

        cy.contains('Login Offline').click();

        cy.contains("You don't have any workspace, create one!");
    });

});
