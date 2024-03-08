export function waitSync(): void {
    cy.see('Syncing');
    cy.dontSee('Syncing');

    // Wait to make sure there weren't any errors. Otherwise, if this is the last
    // command in a test, the error could be caught after the test has succeeded.
    cy.wait(100);
}
