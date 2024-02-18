import { defineCommands } from '@aerogel/cypress';

import * as cloudCommands from './cloud';

const commands = { ...cloudCommands };

type Commands = typeof commands;

defineCommands(commands);

declare global {
    namespace Cypress {
        interface Chainable extends Commands {}
    }
}
