import Soukai, { Engine } from 'soukai';

import List from '@/models/soukai/List';
import OfflineUser from '@/models/users/OfflineUser';
import Task from '@/models/soukai/Task';
import Workspace from '@/models/soukai/Workspace';

import TestingEngine from './engines/TestingEngine';

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
            const engine = new TestingEngine;

            Soukai.useEngine(engine);

            runtime.instance.$store.commit('setUser', user);
            runtime.eventBus.emit('login', user);

            cy.wrap(user).as('user');
            cy.wrap(engine).as('soukaiEngine');
        });
    },

    spyEngine(): Cypress.Chainable<void> {
        return cy.get<Engine>('@soukaiEngine').then(async engine => {
            cy.wrap({
                create: cy.spy(engine, 'create'),
                readOne: cy.spy(engine, 'readOne'),
                readMany: cy.spy(engine, 'readMany'),
                update: cy.spy(engine, 'update'),
                delete: cy.spy(engine, 'delete'),
            }).as('soukaiEngineSpies');
        });
    },

    engineSpiesExpectations(
        expectations: { [method in keyof Engine]?: (spy: Cypress.Agent<sinon.SinonSpy>) => void },
    ): Cypress.Chainable<void> {
        return cy.get('@soukaiEngineSpies').then(async spies => {
            for (const method in spies) {
                const spy = spies[method] as any as Cypress.Agent<sinon.SinonSpy>;

                if (method in expectations) {
                    expectations[method as keyof Engine]!(spy);
                } else {
                    expect(spy).to.not.have.been.called;
                }
            }
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
