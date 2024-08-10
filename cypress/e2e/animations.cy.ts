describe.skip('Animations', () => {
    beforeEach(() => {
        cy.visit('/');
        cy.createStubs();
    });

    it('Tasks collapse/expand (long)', () => {
        cy.visit('/household/groceries');

        cy.press('Completed');
        cy.wait(1000);

        cy.press('Completed');
        cy.wait(1000);

        cy.contains('li', 'Bananas').within(() => cy.get('input[type="checkbox"]').click());
        cy.contains('li', 'Orange juice').within(() => cy.get('input[type="checkbox"]').click());
        cy.wait(1000);

        cy.press('Completed');
        cy.wait(1000);

        cy.press('Completed');
        cy.wait(1000);
    });

    it('Tasks collapse/expand (short)', () => {
        cy.visit('/household');

        cy.press('Completed');
        cy.wait(1000);

        cy.press('Completed');
        cy.wait(1000);

        cy.contains('li', 'Clean room').within(() => cy.get('input[type="checkbox"]').click());
        cy.wait(1000);

        cy.press('Completed');
        cy.wait(1000);

        cy.press('Completed');
        cy.wait(1000);
    });

    it('Tasks toggle', () => {
        cy.visit('/household/groceries');

        cy.press('Completed');
        cy.wait(1000);

        cy.contains('li', 'Bananas').within(() => cy.get('input[type="checkbox"]').click());
        cy.wait(1000);

        cy.contains('li', 'Orange juice').within(() => cy.get('input[type="checkbox"]').click());
        cy.wait(1000);

        cy.press('Completed');
        cy.wait(1000);

        cy.contains('li', 'Orange juice').within(() => cy.get('input[type="checkbox"]').click());
        cy.wait(1000);
    });
});
