import Soukai, { InMemoryEngine } from 'soukai';

import List from '@/models/soukai/List';
import OfflineUser from '@/models/users/OfflineUser';
import Task from '@/models/soukai/Task';
import Workspace from '@/models/soukai/Workspace';

const getRuntime = () => cy.window().its('Runtime').then(runtime => runtime!);

const customCommands = {

    start(): Cypress.Chainable<void> {
        return getRuntime().then(runtime => runtime.start());
    },

    require<T>(name: string): Cypress.Chainable<T> {
        return getRuntime().then(runtime => runtime.require(name));
    },

    login(): Cypress.Chainable<void> {
        return getRuntime().then(async runtime => {
            const Soukai: Soukai = runtime.require('soukai').default;

            const user = new OfflineUser('Cypress');
            const engine = new InMemoryEngine();

            Soukai.useEngine(engine);

            runtime.instance.$store.commit('setUser', user);
            runtime.eventBus.emit('login', user);

            cy.wrap(user).as('user');
            cy.wrap(engine).as('soukaiEngine');
        });
    },

    createWorkspace(name: string, storage: string = ''): Cypress.Chainable<Workspace> {
        return getRuntime().then(runtime => runtime.createWorkspace(name, storage));
    },

    createList(workspace: Workspace, name: string): Cypress.Chainable<List> {
        return getRuntime().then(runtime => runtime.createList(workspace, name));
    },

    createTask(list: List, name: string): Cypress.Chainable<Task> {
        return getRuntime().then(runtime => runtime.createTask(list, name));
    },

};

for (const command in customCommands) {
    Cypress.Commands.add(command, (customCommands as any)[command]);
}

export default customCommands;
