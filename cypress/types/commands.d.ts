/// <reference types="cypress" />

declare namespace Cypress {

    interface Chainable<Subject> {

        start(): Chainable<Subject>;

        require<T>(name: string): Chainable<T>;

        login(): Chainable<Subject>;

        addWorkspace(name: string): Chainable<Subject>;

    }

}
