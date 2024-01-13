describe('App', () => {

    beforeEach(() => cy.visit('/'));

    it('Shows get started link', () => {
        cy.see('Get started');
    });

});
