describe('Navigation', () => {

    beforeEach(() => {
        cy.visit('/');
        cy.createStubs();
        cy.clearLocalStorage();
        cy.ariaLabel('Show lists').click();
    });

    it('Navigates across workspaces and lists', () => {
        cy.press('Groceries');
        cy.seeActiveWorkspace('Household');
        cy.seeActiveList('Groceries');
        cy.see('Nuts');
        cy.see('Chickpeas');
        cy.see('Tomatoes');

        cy.press('Recipes');
        cy.seeActiveWorkspace('Household');
        cy.seeActiveList('Recipes');
        cy.see('Ramen');

        cy.press('Inbox');
        cy.seeActiveWorkspace('Household');
        cy.seeActiveList('Inbox');
        cy.see('Clean room');

        cy.switchWorkspace('Japanese');
        cy.seeActiveWorkspace('Japanese');
        cy.seeActiveList('Inbox');
        cy.see('Learn Heisig Kanji');

        cy.press('Manga');
        cy.seeActiveWorkspace('Japanese');
        cy.seeActiveList('Manga');
        cy.see('Read One Piece');

        cy.switchWorkspace('Main');
        cy.seeActiveWorkspace('Main');
        cy.seeActiveList('Inbox');
        cy.see('Learn Aerogel');
    });

    it('Opens the default workspace', () => {
        // Act
        cy.visit('/');
        cy.ariaLabel('Show lists').click();

        // Assert
        cy.url().should('equal', `${Cypress.config('baseUrl')}/household`);
        cy.seeActiveWorkspace('Household');
        cy.seeActiveList('Inbox');
    });

    it('Opens the last visited workspace', () => {
        // Arrange
        cy.visit('/household/groceries');
        cy.ariaLabel('Show lists').click();
        cy.seeActiveWorkspace('Groceries');

        // Act
        cy.visit('/');
        cy.ariaLabel('Show lists').click();

        // Assert
        cy.url().should('equal', `${Cypress.config('baseUrl')}/household/groceries`);
        cy.seeActiveWorkspace('Household');
        cy.seeActiveList('Groceries');
    });

    it('Opens lists', () => {
        // Act
        cy.visit('/household/groceries');
        cy.ariaLabel('Show lists').click();

        // Assert
        cy.seeActiveList('Groceries');
    });

    it('Changes workspaces', () => {
        // Act
        cy.switchWorkspace('Japanese');

        // Assert
        cy.url().should('equal', `${Cypress.config('baseUrl')}/japanese`);
        cy.seeActiveWorkspace('Japanese');
    });

    it('Changes lists', () => {
        // Open Groceries - Act
        cy.press('Groceries');

        // Open Groceries - Assert
        cy.url().should('equal', `${Cypress.config('baseUrl')}/household/groceries`);
        cy.seeActiveList('Groceries');

        // Open Inbox - Act
        cy.press('Inbox');

        // Open Inbox - Assert
        cy.url().should('equal', `${Cypress.config('baseUrl')}/household`);
        cy.seeActiveList('Inbox');
    });

    it('Shows missing workspaces notice', () => {
        // Act
        cy.visit('/this-does-not-exist');

        // Assert
        cy.see('Couldn\'t find this-does-not-exist workspace');
    });

    it('Shows missing lists notice', () => {
        // Act
        cy.visit('/main/this-does-not-exist');

        // Assert
        cy.see('Couldn\'t find this-does-not-exist list');
    });

});
