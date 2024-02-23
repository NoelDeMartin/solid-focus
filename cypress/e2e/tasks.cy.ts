describe('Tasks', () => {

    beforeEach(() => {
        cy.visit('/');

        // Initialize workspace
        cy.ariaInput('Task name').type('Onboarding task{enter}');
        cy.dontSee('Loading...');
    });

    it('Creates tasks', () => {
        // Create first task - Act
        cy.ariaInput('Task name').type('Cook Ramen{enter}');

        // Create first task - Assert
        cy.see('Cook Ramen', 'li');

        // Create second task - Act
        cy.ariaInput('Task name').type('Eat Ramen{enter}');

        // Create second task - Assert
        cy.see('Eat Ramen', 'li');
    });

    it('Completes tasks', () => {
        // Arrange
        cy.ariaInput('Task name').type('Cook Ramen{enter}');
        cy.see('Cook Ramen');
        cy.ariaInput('Task name').type('Eat Ramen{enter}');
        cy.see('Eat Ramen');

        // Act
        cy.press('Cook Ramen');

        // Assert
        cy.dontSee('Cook Ramen');
        cy.press('Show completed');
        cy.see('Cook Ramen');
    });

    it('Undoes tasks', () => {
        // Arrange
        cy.ariaInput('Task name').type('Cook Ramen{enter}');
        cy.see('Cook Ramen');
        cy.ariaInput('Task name').type('Eat Ramen{enter}');
        cy.see('Eat Ramen');
        cy.press('Cook Ramen');
        cy.press('Eat Ramen');
        cy.press('Show completed');

        // Act
        cy.press('Cook Ramen');
        cy.press('Hide completed');

        // Assert
        cy.dontSee('Eat Ramen');
        cy.see('Cook Ramen');
    });

});
