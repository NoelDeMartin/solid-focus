describe('Tasks', () => {

    beforeEach(() => {
        cy.login();
        cy.addWorkspace('Tasks');
    });

    it('Creates task', () => {
        cy.visit('/');

        cy.get('input').type('Watch Avengers: Endgame');

        cy.get('[title="Create new task"]').click();

        cy.contains('Watch Avengers: Endgame');
    });

});
