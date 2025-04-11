export function seeActiveList(name: string): void {
    cy.see(name, 'li[aria-current="page"]');
}

export function seeActiveWorkspace(name: string): void {
    cy.see(name);
}

export function switchWorkspace(name: string): void {
    cy.contains('.group', 'Select workspace').within(() => {
        cy.get('button[role="combobox"]').click();
    });
    cy.press(name, '*[role="option"]');
}
