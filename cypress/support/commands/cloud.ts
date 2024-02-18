export function waitSync(): void {
    cy.see('Syncing');
    cy.dontSee('Syncing');
}
