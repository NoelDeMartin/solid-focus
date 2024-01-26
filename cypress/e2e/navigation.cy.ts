describe('Navigation', () => {

    beforeEach(() => {
        cy.visit('/');
        cy.ariaInput('Task name').type('...{enter}');
        cy.press('Add new');
        cy.ariaInput('List name').type('Groceries{enter}');
        cy.clearLocalStorage();
    });

    it('Opens the default workspace', () => {
        cy.visit('/');
        cy.see('Main');
        cy.see('Inbox', 'li').within(() => {
            cy.see('(active)');
        });
        cy.url().should('equal', `${Cypress.config('baseUrl')}/main`);
    });

    it('Opens the last visited workspace', () => {
        cy.visit('/main/groceries');
        cy.visit('/');
        cy.see('Main');
        cy.see('Groceries', 'li').within(() => {
            cy.see('(active)');
        });
        cy.url().should('equal', `${Cypress.config('baseUrl')}/main/groceries`);
    });

    it('Opens lists', () => {
        cy.visit('/main/groceries');
        cy.see('Groceries', 'li').within(() => {
            cy.see('(active)');
        });
    });

    it('Changes lists', () => {
        cy.visit('/');

        // Open Groceries.
        cy.press('Groceries');
        cy.see('Groceries', 'li').within(() => {
            cy.see('(active)');
        });
        cy.url().should('equal', `${Cypress.config('baseUrl')}/main/groceries`);

        // Open Inbox.
        cy.press('Inbox');
        cy.see('Inbox', 'li').within(() => {
            cy.see('(active)');
        });
        cy.url().should('equal', `${Cypress.config('baseUrl')}/main/inbox`);
    });

    it('Shows missing workspaces notice', () => {
        cy.visit('/this-does-not-exist');
        cy.see('Could not find \'this-does-not-exist\' workspace');
    });

    it('Shows missing lists notice', () => {
        cy.visit('/main/this-does-not-exist');
        cy.see('Could not find \'this-does-not-exist\' list');
    });

});
