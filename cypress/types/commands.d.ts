/// <reference types="cypress" />

declare namespace Cypress {

    interface Chainable<Subject> {

        start(): Chainable<Subject>;

        login(): Chainable<Subject>;

        addWorkspace(name: string): Chainable<Subject>;

    }

}
