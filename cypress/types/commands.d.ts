/// <reference types="cypress" />

import commands from '@cy/support/commands';

type CustomCommands<Subject> = {
    [command in keyof typeof commands]: typeof commands[command];
};

declare global {

    namespace Cypress {

        interface Chainable<Subject> extends CustomCommands<Subject> {

        }

    }

}
