import { webId } from '@aerogel/cypress';

describe('Cloud', () => {

    beforeEach(() => {
        cy.solidReset();
        cy.visit('/');
    });

    it('Postpones migrating local data', () => {
        // Arrange
        cy.ariaInput('Task name').type('Onboarding task{enter}');
        cy.ariaLabel('View sync status').click();
        cy.ariaInput('Login url').type(`${webId()}{enter}`);
        cy.solidLogin();

        // Act
        cy.see('Your data is only stored locally, do you want to upload it to the cloud?');
        cy.press('not now');

        // Assert
        cy.dontSee('Your data is only stored locally, do you want to upload it to the cloud?');
        cy.see('Onboarding task');
        cy.ariaLabel('View sync status').click();
        cy.see('Your data is only stored locally, do you want to upload it to the cloud?');

        cy.reload();
        cy.see('Onboarding task');
    });

});
