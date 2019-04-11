import Faker from 'faker';

describe('Tasks', () => {

    beforeEach(() => {
        cy.login();
    });

    it('Creates a workspace', () => {
        const name = Faker.lorem.sentence();

        cy.visit('/');

        cy.get('[title="Create new workspace"]').click();

        cy.get('input').type(name).type('{enter}');

        cy.contains(name);
        cy.contains('Inbox');
    });

    it('Creates a list', () => {
        const name = Faker.lorem.sentence();

        cy.addWorkspace(Faker.lorem.sentence());

        cy.contains('a', 'Add List').click();

        cy.get('.v-dialog').within(() => {
            cy.get('input').type(name).type('{enter}');
        });

        cy.contains(name);
    });

    it('Creates a task', () => {
        const name = Faker.lorem.sentence();

        cy.addWorkspace(Faker.lorem.sentence());

        cy.visit('/');

        cy.get('input').type(name).type('{enter}');

        cy.contains(name);
    });

});
