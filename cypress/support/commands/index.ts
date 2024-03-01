import { defineCommands } from '@aerogel/cypress';

import * as cloudCommands from './cloud';
import * as navigationCommands from './navigation';
import * as stubsCommands from './stubs';

const commands = {
    ...cloudCommands,
    ...navigationCommands,
    ...stubsCommands,
};

type Commands = typeof commands;

defineCommands(commands);

declare global {
    namespace Cypress {
        interface Chainable extends Commands {}
    }
}
