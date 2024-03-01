export function seeActiveList(name: string): void {
    cy.see(name, 'li').within(() => {
        cy.see('(active)');
    });
}

export function seeActiveWorkspace(name: string): void {
    cy.see(name);
}

export function switchWorkspace(name: string): void {
    cy.ariaLabel('Select workspace').within(() => {
        cy.get('button').click();
    });
    cy.press(name, 'li');
}
