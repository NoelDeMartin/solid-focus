import { podUrl, webId } from '@aerogel/cypress';

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
        cy.ariaInput('Complete task', { description: 'Sync updates' }).click();

        // Assert
        cy.get('@updateTask.all').should('have.length', 1);

        cy.fixture('sparql/complete-task.sparql').then((sparql) => {
            cy.get('@updateTask').its('response.statusCode').should('eq', 205);
            cy.get('@updateTask').its('request.body').should('be.sparql', sparql);
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
        cy.ariaLabel('Select workspace').within(() => {
            cy.get('button').click();
        });
        cy.press('Add new', 'li');
        cy.ariaInput('Workspace name').type('Work{enter}');
        cy.waitSync();

        cy.press('New list');
        cy.ariaInput('List name').type('Learning{enter}');
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
        cy.ariaLabel('View sync status').click();
        cy.ariaInput('Login url').type(`${webId()}{enter}`);
        cy.solidLogin();

        // Act
        cy.see('Your data is only stored locally, do you want to upload it to the cloud?');
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
        cy.ariaLabel('View sync status').click();
        cy.ariaInput('Login url').type(`${webId()}{enter}`);
        cy.solidLogin();

        // Act
        cy.see('Your data is only stored locally, do you want to upload it to the cloud?');
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
