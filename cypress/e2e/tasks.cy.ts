describe('Tasks', () => {

    beforeEach(() => {
        cy.visit('/');

        // Initialize workspace
        cy.press('Get started');
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

    it('Updates tasks', () => {
        // Arrange
        cy.ariaInput('Task name').type('Cook Ramen{enter}');
        cy.see('Cook Ramen');

        // Act
        cy.ariaLabel('Select task \\"Cook Ramen\\"').click();
        cy.ariaLabel('Edit name').click();
        cy.get(':focus').type('!');
        cy.get('[name="description"]').type('Ramen is good for your soul.');
        cy.press('Save');

        // Assert
        cy.see('Cook Ramen!', { srOnly: true });
        cy.see('Ramen is good for your soul.', { srOnly: true });
    });

    it('Completes tasks', () => {
        // Arrange
        cy.ariaInput('Task name').type('Cook Ramen{enter}');
        cy.see('Cook Ramen');
        cy.ariaInput('Task name').type('Eat Ramen{enter}');
        cy.see('Eat Ramen');

        // Act
        cy.ariaInput('Complete task', { description: 'Cook Ramen' }).click();

        // Assert
        cy.dontSee('Cook Ramen');
        cy.ariaLabel('Show completed').click();
        cy.see('Cook Ramen');
    });

    it('Undoes tasks', () => {
        // Arrange
        cy.ariaInput('Task name').type('Cook Ramen{enter}');
        cy.see('Cook Ramen');
        cy.ariaInput('Task name').type('Eat Ramen{enter}');
        cy.see('Eat Ramen');
        cy.ariaInput('Complete task', { description: 'Cook Ramen' }).click();
        cy.ariaInput('Complete task', { description: 'Eat Ramen' }).click();
        cy.ariaLabel('Show completed').click();

        // Act
        cy.ariaInput('Undo task', { description: 'Cook Ramen' }).click();
        cy.ariaLabel('Hide completed').click();

        // Assert
        cy.dontSee('Eat Ramen');
        cy.see('Cook Ramen');
    });

});
