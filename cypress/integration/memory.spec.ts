import Faker from 'faker';

describe('Memory', () => {

    beforeEach(() => {
        cy.visit('/');
        cy.start({ persistSessions: true });
        cy.login();
    });

    it('Remembers active workspaces and lists', () => {
        const workspaceName = Faker.lorem.sentence();
        const listName = Faker.lorem.sentence();

        cy.createWorkspace(Faker.lorem.sentence());
        cy.createWorkspace(workspaceName).then(workspace => {
            cy.createList(workspace, listName);
        });

        cy.restart();

        cy.contains('#app-navigation-drawer', workspaceName).should('be.visible');
        cy.contains('.v-toolbar', listName).should('be.visible');
    });

});
