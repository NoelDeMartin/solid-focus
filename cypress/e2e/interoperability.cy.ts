import { podUrl, webId } from '@aerogel/cypress';

describe('Interoperability', () => {

    beforeEach(() => {
        cy.visit('/');
        cy.solidReset();
    });

    it('Works with legacy schemas', () => {
        // Arrange
        cy.solidCreateContainer('/tasks/', 'Tasks');
        cy.solidUpdateDocument('/tasks/.meta', 'sparql/prepare-legacy-container.sparql', { url: podUrl('/tasks/') });
        cy.solidCreateDocument('/tasks/legacy-task', 'turtle/legacy-task.ttl');
        cy.solidUpdateDocument('/profile/card', 'sparql/prepare-legacy-profile.sparql');

        cy.intercept('PATCH', podUrl('/tasks/legacy-task')).as('updateTask');
        cy.intercept('PATCH', podUrl('/tasks/!(legacy-task*)')).as('createTask');
        cy.intercept('PATCH', podUrl('/settings/privateTypeIndex')).as('registerWorkspace');

        // Act - Log in & postpone migration
        cy.press('Log in');
        cy.ariaInput('Login url').type(`${webId()}{enter}`);
        cy.solidLogin();
        cy.waitSync();

        cy.press('not yet');
        cy.press('Ok');

        // Assert - Log in
        cy.press('Completed');
        cy.see('Learn Solid');
        cy.contains('Important').should('exist');
        cy.ariaLabel('Select task \\"Learn Solid\\"').click();
        cy.contains('This was created a long time ago').should('exist');
        cy.contains('Due on Jan 1, 2019').should('exist');
        cy.contains('Completed on Dec 25, 2018').should('exist');

        cy.get('@updateTask.all').should('have.length', 1);
        cy.fixture('sparql/update-legacy-task-1.sparql').then((sparql) => {
            cy.get('@updateTask.1').its('response.statusCode').should('eq', 205);
            cy.get('@updateTask.1').its('request.body').should('be.sparql', sparql);
        });

        cy.get('@registerWorkspace.all').should('have.length', 1);
        cy.fixtureWithReplacements('sparql/register-workspace.sparql', {
            resourceHash: '[[.*]]',
            forClass: '<http://purl.org/vocab/lifecycle/schema#Task>',
            containerUrl: podUrl('/tasks/'),
        }).then((sparql) => {
            cy.get('@registerWorkspace.1').its('response.statusCode').should('eq', 205);
            cy.get('@registerWorkspace.1').its('request.body').should('be.sparql', sparql);
        });

        // Act - Toggle important
        cy.ariaLabel('Remove important').click();
        cy.waitSync();

        // Assert - Toggle important
        cy.get('@updateTask.all').should('have.length', 2);
        cy.fixture('sparql/update-legacy-task-2.sparql').then((sparql) => {
            cy.get('@updateTask.2').its('response.statusCode').should('eq', 205);
            cy.get('@updateTask.2').its('request.body').should('be.sparql', sparql);
        });

        // Act - Create task
        cy.ariaInput('Task name').type('Rebuild app{enter}');
        cy.waitSync();

        // Assert - Create task
        cy.get('@createTask.all').should('have.length', 1);
        cy.fixture('sparql/create-legacy-task.sparql').then((sparql) => {
            cy.get('@createTask.1').its('response.statusCode').should('eq', 201);
            cy.get('@createTask.1').its('request.body').should('be.sparql', sparql);
        });

        // Act - Reload
        cy.ariaLabel('Open account status').click();
        cy.press('Advanced options', 'summary');
        cy.press('Reconnect on startup');
        cy.get('body').type('{esc}');
        cy.reload();

        // Assert - Reload
        cy.see('Learn Solid');
        cy.see('Rebuild app');
        cy.contains('Important').should('not.exist');
    });

    it('Updates in legacy schema are propagated', () => {
        // Arrange
        cy.solidCreateContainer('/tasks/', 'Tasks');
        cy.solidUpdateDocument('/tasks/.meta', 'sparql/prepare-legacy-container.sparql', { url: podUrl('/tasks/') });
        cy.solidCreateDocument('/tasks/legacy-task', 'turtle/legacy-task.ttl');
        cy.solidCreateDocument('/settings/privateTypeIndex', '<> a <http://www.w3.org/ns/solid/terms#TypeIndex> .');
        cy.solidUpdateDocument('/settings/privateTypeIndex', 'sparql/register-workspace.sparql', {
            forClass: '<http://purl.org/vocab/lifecycle/schema#Task>',
            containerUrl: podUrl('/tasks/'),
        });
        cy.solidUpdateDocument('/profile/card', 'sparql/prepare-legacy-profile.sparql');
        cy.solidUpdateDocument('/profile/card', 'sparql/declare-type-index.sparql');

        cy.intercept('PATCH', podUrl('/settings/privateTypeIndex')).as('registerWorkspace');

        cy.press('Log in');
        cy.ariaInput('Login url').type(`${webId()}{enter}`);
        cy.solidLogin();
        cy.waitSync();

        cy.press('not yet');
        cy.press('Ok');

        // Act
        cy.solidUpdateDocument('/tasks/legacy-task', 'sparql/undo-legacy-task.sparql');

        cy.intercept('PATCH', podUrl('/tasks/legacy-task')).as('updateTask');

        cy.ariaLabel('Open account status').click();
        cy.press('Synchronize', 'button');
        cy.get('body').type('{esc}');
        cy.waitSync();

        // Assert
        cy.dontSee('Completed');

        cy.get('@registerWorkspace.all').should('have.length', 0);

        cy.get('@updateTask.all').should('have.length', 1);
        cy.fixture('sparql/reconcile-legacy-task.sparql').then((sparql) => {
            cy.get('@updateTask.1').its('response.statusCode').should('eq', 205);
            cy.get('@updateTask.1').its('request.body').should('be.sparql', sparql);
        });
    });

    it('Work with exclusive schema.org tasks', () => {
        // Arrange
        cy.solidCreateContainer('/tasks/', 'Tasks');
        cy.solidCreateDocument('/settings/privateTypeIndex', '<> a <http://www.w3.org/ns/solid/terms#TypeIndex> .');
        cy.solidUpdateDocument('/settings/privateTypeIndex', 'sparql/register-workspace.sparql', {
            containerUrl: podUrl('/tasks/'),
            forClass: '<https://schema.org/Action>',
        });
        cy.solidUpdateDocument('/profile/card', 'sparql/declare-type-index.sparql');
        cy.solidCreateDocument(
            '/tasks/hello',
            `
                <#it>
                    a <https://schema.org/Action> ;
                    <https://schema.org/name> "Hello for schema.org".
            `,
        );

        // Act
        cy.press('Log in');
        cy.ariaInput('Login url').type(`${webId()}{enter}`);
        cy.solidLogin();

        // Assert
        cy.see('Synchronization in progress');
        cy.see('Hello for schema.org');
    });

    it('Work with exclusive ical tasks', () => {
        // Arrange
        cy.solidCreateContainer('/tasks/', 'Tasks');
        cy.solidCreateDocument('/settings/privateTypeIndex', '<> a <http://www.w3.org/ns/solid/terms#TypeIndex> .');
        cy.solidUpdateDocument('/settings/privateTypeIndex', 'sparql/register-workspace.sparql', {
            containerUrl: podUrl('/tasks/'),
            forClass: '<http://www.w3.org/2002/12/cal/ical#Vtodo>',
        });
        cy.solidUpdateDocument('/profile/card', 'sparql/declare-type-index.sparql');
        cy.solidCreateDocument(
            '/tasks/hello',
            `
                <#it>
                    a <http://www.w3.org/2002/12/cal/ical#Vtodo> ;
                    <http://www.w3.org/2002/12/cal/ical#summary> "Hello for ical".
            `,
        );

        // Act
        cy.press('Log in');
        cy.ariaInput('Login url').type(`${webId()}{enter}`);
        cy.solidLogin();

        // Assert
        cy.see('Synchronization in progress');
        cy.see('Hello for ical');
    });

    it('Migrates schemas', () => {
        // Arrange
        cy.solidCreateContainer('/tasks/', 'Tasks');
        cy.solidUpdateDocument('/tasks/.meta', 'sparql/prepare-legacy-container.sparql', { url: podUrl('/tasks/') });
        cy.solidCreateDocument('/tasks/legacy-task', 'turtle/legacy-task.ttl');
        cy.solidUpdateDocument('/profile/card', 'sparql/prepare-legacy-profile.sparql');

        cy.press('Log in');
        cy.ariaInput('Login url').type(`${webId()}{enter}`);
        cy.solidLogin();
        cy.waitSync();

        cy.intercept('PATCH', podUrl('/tasks/legacy-task')).as('updateTask');

        // Act
        cy.see('Your data is using an old schema');
        cy.press('Migrate now');
        cy.see('Migrating');
        cy.dontSee('Migrating');

        // Assert
        cy.get('@updateTask.all').should('have.length', 1);

        cy.fixture('turtle/migrated-task.ttl').then((expected) => {
            cy.solidReadDocument('/tasks/legacy-task').then((actual) => {
                cy.wrap(actual).should('be.turtle', expected);
            });
        });

        cy.fixture('jsonld/migrated-task.jsonld').then((expected) => {
            cy.indexedDBDocument(podUrl('/tasks/legacy-task')).then((actual) => {
                cy.assertJsonLD(expected, actual);
            });
        });
    });

    it('Migrates postponed schemas', () => {
        // Arrange
        cy.solidCreateContainer('/tasks/', 'Tasks');
        cy.solidUpdateDocument('/tasks/.meta', 'sparql/prepare-legacy-container.sparql', { url: podUrl('/tasks/') });
        cy.solidCreateDocument('/tasks/legacy-task', 'turtle/legacy-task.ttl');
        cy.solidUpdateDocument('/profile/card', 'sparql/prepare-legacy-profile.sparql');

        // Arrange - Log in
        cy.press('Log in');
        cy.ariaInput('Login url').type(`${webId()}{enter}`);
        cy.solidLogin();
        cy.waitSync();

        cy.press('not yet');
        cy.press('Ok');

        // Arrange - Update
        cy.press('Completed');
        cy.ariaLabel('Select task \\"Learn Solid\\"').click();
        cy.ariaLabel('Remove important').click();
        cy.waitSync();

        cy.intercept('PATCH', podUrl('/tasks/legacy-task')).as('updateTask');

        // Act - Migrate
        cy.ariaLabel('Open account status').click();
        cy.ariaLabel('Settings').click();
        cy.press('Migrate');
        cy.see('Migrating');
        cy.dontSee('Migrating');

        // Assert - Migrate
        cy.get('@updateTask.all').should('have.length', 1);

        cy.fixture('turtle/migrated-postponed-task.ttl').then((expected) => {
            cy.solidReadDocument('/tasks/legacy-task').then((actual) => {
                cy.wrap(actual).should('be.turtle', expected);
            });
        });

        cy.fixture('jsonld/migrated-postponed-task.jsonld').then((expected) => {
            cy.indexedDBDocument(podUrl('/tasks/legacy-task')).then((actual) => {
                cy.assertJsonLD(expected, actual);
            });
        });

        // Act - Update
        cy.ariaLabel('Select task \\"Learn Solid\\"').click();
        cy.press('Not important');
        cy.waitSync();

        // Assert - Update
        cy.get('@updateTask.all').should('have.length', 2);

        cy.fixture('sparql/update-migrated-task.sparql').then((sparql) => {
            cy.get('@updateTask.2').its('response.statusCode').should('eq', 205);
            cy.get('@updateTask.2').its('request.body').should('be.sparql', sparql);
        });
    });

});
