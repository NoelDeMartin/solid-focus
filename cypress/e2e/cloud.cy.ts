import { escapeRegexText } from '@noeldemartin/utils';
import { podUrl, webId } from '@aerogel/cypress';

import type Task from '@/models/Task';

describe('Cloud', () => {

    beforeEach(() => {
        cy.solidReset();
        cy.visit('/');
    });

    it('Syncs updated tasks', () => {
        // Arrange
        cy.press('Log in');
        cy.ariaInput('Login url').type(`${webId()}{enter}`);
        cy.solidLogin();
        cy.ariaInput('Task name').type('Sync updates{enter}');
        cy.dontSee('Loading...');

        cy.intercept('PATCH', podUrl('/main/*')).as('updateTask');

        // Act
        cy.contains('li', 'Sync updates').within(() => cy.get('input[type="checkbox"]').click());

        // Assert
        cy.get('@updateTask.all').should('have.length', 1);

        cy.fixture('sparql/complete-task.sparql').then((sparql) => {
            cy.get('@updateTask').its('response.statusCode').should('eq', 205);
            cy.get('@updateTask').its('request.body').should('be.sparql', sparql);
        });
    });

    it('Syncs deleted tasks', () => {
        // Arrange
        cy.press('Log in');
        cy.ariaInput('Login url').type(`${webId()}{enter}`);
        cy.solidLogin();
        cy.ariaInput('Task name').type('To delete{enter}');
        cy.dontSee('Loading...');

        cy.model('Workspace').then(async (Workspace) => {
            const main = await Workspace.find(podUrl('/main/'));
            const tasks = await main?.loadRelation<Task[]>('tasks');
            const task = tasks?.[0];

            if (task) {
                const turtle = await task.toTurtle();

                cy.wrap(turtle.replace(new RegExp(escapeRegexText(task.url), 'g'), '#it')).as('taskTurtle');
            }
        });
        cy.intercept('PATCH', podUrl('/main/*')).as('updateTask');

        // Act
        cy.ariaLabel('Select task \\"To delete\\"').click();
        cy.ariaLabel('Delete').click();
        cy.press('Delete');

        // Assert
        cy.get('@taskTurtle').then((taskTurtle) => {
            cy.get('@updateTask')
                .its('request.body')
                .should(
                    'be.sparql',
                    `
                        DELETE DATA { ${taskTurtle} } ;
                        INSERT DATA {
                            @prefix crdt: <https://vocab.noeldemartin.com/crdt/> .
                            @prefix xsd: <http://www.w3.org/2001/XMLSchema#> .

                            <#it-metadata>
                                a crdt:Tombstone ;
                                crdt:resource <#it> ;
                                crdt:deletedAt  "[[.*]]"^^xsd:dateTime .
                        } .
                    `,
                );
        });
    });

    it('Syncs new workspaces and lists', () => {
        // Arrange
        cy.press('Log in');
        cy.ariaInput('Login url').type(`${webId()}{enter}`);
        cy.solidLogin();
        cy.ariaInput('Task name').type('Sync updates{enter}');
        cy.dontSee('Loading...');

        cy.intercept('PUT', podUrl('/work/')).as('createWorkContainer');
        cy.intercept('PATCH', podUrl('/work/.meta')).as('createWorkContainerMeta');
        cy.intercept('PUT', podUrl('/work/learning/')).as('createLearningContainer');
        cy.intercept('PATCH', podUrl('/work/learning/.meta')).as('createLearningContainerMeta');

        // Act
        cy.ariaLabel('Show lists').click();
        cy.switchWorkspace('New workspace');
        cy.ariaInput('Name').type('Work{enter}');
        cy.waitSync();

        cy.press('New list');
        cy.ariaInput('Name').type('Learning{enter}');
        cy.waitSync();

        // Assert
        cy.get('@createWorkContainer.all').should('have.length', 1);
        cy.get('@createWorkContainerMeta.all').should('have.length', 1);
        cy.get('@createLearningContainer.all').should('have.length', 1);
        cy.get('@createLearningContainerMeta.all').should('have.length', 1);
    });

    it('Migrates simple local data', () => {
        // Arrange
        cy.intercept('PUT', podUrl('/main/')).as('createContainer');
        cy.intercept('PATCH', podUrl('/main/.meta')).as('createContainerMeta');
        cy.intercept('PATCH', podUrl('/main/*')).as('createTask');

        cy.press('Get started');
        cy.ariaInput('Task name').type('Onboarding task{enter}');
        cy.ariaLabel('Configuration').click();
        cy.press('Connect account');
        cy.ariaInput('Login url').type(`${webId()}{enter}`);
        cy.solidLogin();

        // Act
        cy.see('All your eggs are in the same basket');
        cy.press('Back up');
        cy.dontSee('Loading...');

        // Assert
        cy.ariaLabel('Show lists').click();
        cy.seeActiveWorkspace('Main');
        cy.see('Onboarding task');
        cy.seeActiveList('Inbox');

        cy.get('@createContainer.all').should('have.length', 1);
        cy.get('@createContainerMeta.all').should('have.length', 1);
        cy.get('@createTask.all').should('have.length', 1);

        cy.fixtureWithReplacements('sparql/create-container-meta.sparql', { url: podUrl('/main/'), name: 'Main' }).then(
            (sparql) => {
                cy.get('@createContainerMeta').its('response.statusCode').should('eq', 205);
                cy.get('@createContainerMeta').its('request.body').should('be.sparql', sparql);
            },
        );

        cy.fixtureWithReplacements('sparql/create-task.sparql', { name: 'Onboarding task' }).then((sparql) => {
            cy.get('@createTask').its('response.statusCode').should('eq', 201);
            cy.get('@createTask').its('request.body').should('be.sparql', sparql);
        });
    });

    it('Migrates complex local data', () => {
        // Arrange
        cy.intercept('PUT', podUrl('/main/')).as('createMainContainer');
        cy.intercept('PUT', podUrl('/household/')).as('createHouseholdContainer');
        cy.intercept('PUT', podUrl('/household/groceries/')).as('createGroceriesContainer');
        cy.intercept('PUT', podUrl('/household/recipes/')).as('createRecipesContainer');
        cy.intercept('PUT', podUrl('/japanese/')).as('createJapaneseContainer');
        cy.intercept('PUT', podUrl('/japanese/manga/')).as('createMangaContainer');
        cy.intercept('PATCH', podUrl('/main/*')).as('createMainTask');
        cy.intercept('PATCH', podUrl('/household/*')).as('createHouseholdTask');
        cy.intercept('PATCH', podUrl('/household/groceries/*')).as('createGroceriesTask');
        cy.intercept('PATCH', podUrl('/household/recipes/*')).as('createRecipesTask');
        cy.intercept('PATCH', podUrl('/japanese/*')).as('createJapaneseTask');
        cy.intercept('PATCH', podUrl('/japanese/manga/*')).as('createMangaTask');

        cy.createStubs();
        cy.ariaLabel('Configuration').click();
        cy.press('Connect account');
        cy.ariaInput('Login url').type(`${webId()}{enter}`);
        cy.solidLogin();

        // Act
        cy.see('All your eggs are in the same basket');
        cy.press('Back up');
        cy.dontSee('Loading...', { timeout: 30000 });

        // Assert
        cy.get('@createMainContainer.all').should('have.length', 1);
        cy.get('@createHouseholdContainer.all').should('have.length', 1);
        cy.get('@createGroceriesContainer.all').should('have.length', 1);
        cy.get('@createRecipesContainer.all').should('have.length', 1);
        cy.get('@createJapaneseContainer.all').should('have.length', 1);
        cy.get('@createMangaContainer.all').should('have.length', 1);
        cy.get('@createMainTask.all').should('have.length', 4);
        cy.get('@createHouseholdTask.all').should('have.length', 2);
        cy.get('@createGroceriesTask.all').should('have.length', 3);
        cy.get('@createRecipesTask.all').should('have.length', 3);
        cy.get('@createJapaneseTask.all').should('have.length', 3);
        cy.get('@createMangaTask.all').should('have.length', 2);
    });

    it('Postpones migrating local data', () => {
        // Arrange
        cy.press('Get started');
        cy.ariaInput('Task name').type('Onboarding task{enter}');
        cy.ariaLabel('Configuration').click();
        cy.press('Connect account');
        cy.ariaInput('Login url').type(`${webId()}{enter}`);
        cy.solidLogin();

        // Act
        cy.see('All your eggs are in the same basket');
        cy.press('not yet');
        cy.ariaLabel('Open account status').click();
        cy.press('Advanced options');
        cy.press('Reconnect on startup');
        cy.get('body').type('{esc}');

        // Assert
        cy.dontSee('All your eggs are in the same basket');
        cy.see('Onboarding task');
        cy.ariaLabel('Open account status').click();
        cy.see('Your data is not backed up yet');

        cy.reload();
        cy.dontSee('All your eggs are in the same basket');
        cy.see('Onboarding task');
    });

    it('Creates lists with unicode characters', () => {
        // Arrange
        cy.press('Log in');
        cy.ariaInput('Login url').type(`${webId()}{enter}`);
        cy.solidLogin();

        // Ideally, we'd test task names with unicode characters as well, but the following causes an
        // issue in CSS using in-memory storage.
        // See https://github.com/CommunitySolidServer/CommunitySolidServer/issues/1907
        // cy.ariaInput('Task name').type('行くぞ{enter}'); // TODO this causes 401 response :/
        cy.ariaInput('Task name').type('Testing{enter}');

        cy.waitSync();
        cy.ariaLabel('Show lists').click();

        cy.intercept('PUT', podUrl('/main/*')).as('createContainer');

        // Act
        cy.press('New list');

        cy.ariaInput('Name').type('勉強{enter}');
        cy.waitSync();
        cy.reload();
        cy.solidAuthorize();
        cy.waitSync();
        cy.ariaLabel('Show lists').click();
        cy.seeActiveWorkspace('勉強');

        // Assert
        cy.get('@createContainer.all').should('have.length', 1);

        cy.url().should('equal', `${Cypress.config('baseUrl')}/main/${encodeURIComponent('勉強')}`);
    });

});
