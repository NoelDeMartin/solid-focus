export function waitSync(): void {
    cy.see('Synchronization in progress');
    cy.dontSee('Synchronization in progress');

    // Wait to make sure there weren't any errors. Otherwise, if this is the last
    // command in a test, the error could be caught after the test has succeeded.
    cy.wait(100);
}
