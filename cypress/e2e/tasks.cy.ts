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
        cy.ariaLabel('Description').type('Ramen is good for your soul.');
        cy.press('Save');

        // Assert
        cy.see('Cook Ramen!', { srOnly: true });
        cy.see('Ramen is good for your soul.', { srOnly: true });
    });

    it('Toggles important tasks', () => {
        // Arrange
        cy.ariaInput('Task name').type('Cook Ramen{enter}');
        cy.see('Cook Ramen');

        // Act - Make important
        cy.ariaLabel('Select task \\"Cook Ramen\\"').click();
        cy.ariaLabel('Make important').click();

        // Assert - Make important
        cy.see('Cook Ramen (Important)');

        // Act - Remove important
        cy.ariaLabel('Remove important').click();

        // Assert - Remove important
        cy.dontSee('Cook Ramen (Important)');
    });

    it('Edits due dates', () => {
        // Arrange
        cy.ariaInput('Task name').type('Cook Ramen{enter}');
        cy.see('Cook Ramen');

        // Act - Set due date
        cy.ariaLabel('Select task \\"Cook Ramen\\"').click();
        cy.ariaLabel('Edit due date').click();
        cy.get(':focus').then((element) => {
            const input = element[0] as HTMLInputElement;

            input.valueAsDate = new Date();
            input.dispatchEvent(new Event('input'));
        });
        cy.press('Save');

        // Assert - Set due date
        cy.see('Today');

        // Act - Remove due date
        cy.ariaLabel('Edit due date').click();
        cy.get(':focus').then((element) => {
            const input = element[0] as HTMLInputElement;

            input.value = '';
            input.dispatchEvent(new Event('input'));
        });
        cy.press('Save');

        // Assert - Remove due date
        cy.dontSee('Today');
    });

    it('Completes tasks', () => {
        // Arrange
        cy.ariaInput('Task name').type('Cook Ramen{enter}');
        cy.see('Cook Ramen');
        cy.ariaInput('Task name').type('Eat Ramen{enter}');
        cy.see('Eat Ramen');

        // Act
        cy.contains('li', 'Cook Ramen').within(() => cy.get('input[type="checkbox"]').click());

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
        cy.contains('li', 'Cook Ramen').within(() => cy.get('input[type="checkbox"]').click());
        cy.contains('li', 'Eat Ramen').within(() => cy.get('input[type="checkbox"]').click());
        cy.ariaLabel('Show completed').click();

        // Act
        cy.contains('li', 'Cook Ramen').within(() => cy.get('input[type="checkbox"]').click());
        cy.ariaLabel('Hide completed').click();

        // Assert
        cy.dontSee('Eat Ramen');
        cy.see('Cook Ramen');
    });

    it('Removes tasks', () => {
        // Arrange
        cy.ariaInput('Task name').type('Cook Ramen{enter}');
        cy.see('Cook Ramen');

        // Act
        cy.ariaLabel('Select task \\"Cook Ramen\\"').click();
        cy.ariaLabel('Delete').click();
        cy.see('This will delete your task Cook Ramen');
        cy.press('Delete');

        // Assert
        cy.dontSee('Cook Ramen');
    });

});
