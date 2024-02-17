describe('Navigation', () => {

    beforeEach(() => {
        cy.visit('/');

        // Create task
        cy.ariaInput('Task name').type('...{enter}');

        // Create list
        cy.press('Add new');
        cy.ariaInput('List name').type('Groceries{enter}');

        // Create first workspace
        cy.ariaLabel('Select workspace').within(() => {
            cy.get('button').click();
        });
        cy.press('Add new', 'li');
        cy.ariaInput('Workspace name').type('Study{enter}');
        cy.see('Study');

        cy.clearLocalStorage();
    });

    it('Opens the default workspace', () => {
        // Act
        cy.visit('/');

        // Assert
        cy.url().should('equal', `${Cypress.config('baseUrl')}/main`);
        cy.see('Main');
        cy.see('Inbox', 'li').within(() => {
            cy.see('(active)');
        });
    });

    it('Opens the last visited workspace', () => {
        // Arrange
        cy.visit('/main/groceries');
        cy.see('Groceries');

        // Act
        cy.visit('/');

        // Assert
        cy.url().should('equal', `${Cypress.config('baseUrl')}/main/groceries`);
        cy.see('Main');
        cy.see('Groceries', 'li').within(() => {
            cy.see('(active)');
        });
    });

    it('Opens lists', () => {
        // Act
        cy.visit('/main/groceries');

        // Assert
        cy.see('Groceries', 'li').within(() => {
            cy.see('(active)');
        });
    });

    it('Changes workspaces', () => {
        // Act
        cy.ariaLabel('Select workspace').within(() => {
            cy.get('button').click();
        });
        cy.press('Study', 'li');

        // Assert
        cy.url().should('equal', `${Cypress.config('baseUrl')}/study`);
        cy.see('Study');
    });

    it('Changes lists', () => {
        // Arrange
        cy.visit('/');

        // Open Groceries - Act
        cy.press('Groceries');

        // Open Groceries - Assert
        cy.url().should('equal', `${Cypress.config('baseUrl')}/main/groceries`);
        cy.see('Groceries', 'li').within(() => {
            cy.see('(active)');
        });

        // Open Inbox - Act
        cy.press('Inbox');

        // Open Inbox - Assert
        cy.url().should('equal', `${Cypress.config('baseUrl')}/main`);
        cy.see('Inbox', 'li').within(() => {
            cy.see('(active)');
        });
    });

    it('Shows missing workspaces notice', () => {
        // Act
        cy.visit('/this-does-not-exist');

        // Assert
        cy.see('Could not find \'this-does-not-exist\' workspace');
    });

    it('Shows missing lists notice', () => {
        // Act
        cy.visit('/main/this-does-not-exist');

        // Assert
        cy.see('Could not find \'this-does-not-exist\' list');
    });

});
