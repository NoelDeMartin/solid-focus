import Soukai, { Engine, InMemoryEngine, LocalStorageEngine } from 'soukai';

import List from '@/models/soukai/List';
import OfflineUser from '@/models/users/OfflineUser';
import Task from '@/models/soukai/Task';
import Workspace from '@/models/soukai/Workspace';

import TestingEngine from './engines/TestingEngine';

interface Config {
    persistSessions?: boolean;
    useRealEngines?: boolean;
}

const getRuntime = () => cy.window().its('Runtime').then(runtime => runtime!);

function setupTestingEngine(config: Config): void {
    getRuntime().then(runtime => {
        const Soukai: Soukai = runtime.require('soukai').default;
        const engine = new TestingEngine(
            config.persistSessions
                ? new LocalStorageEngine('solid-focus-')
                : new InMemoryEngine
        );

        Soukai.useEngine(engine);

        cy.wrap(engine).as('soukaiEngine');
    });
}

const customCommands = {

    start(config: Config = {}): void {
        cy.wrap(config).as('config');

        if (!config.useRealEngines)
            setupTestingEngine(config);

        getRuntime().then(runtime => runtime.start());
    },

    restart(): void {
        cy.reload();
        cy.get<Config>('@config').then(config => cy.start(config));
    },

    require<T>(name: string): Cypress.Chainable<T> {
        return getRuntime().then(runtime => runtime.require(name));
    },

    login(): void {
        cy.get<Config>('@config').then(config => {
            getRuntime().then(runtime => {
                const user = new OfflineUser('Cypress');

                if (config.persistSessions)
                    localStorage.setItem('user', JSON.stringify(user.toJson()));

                runtime.instance.$store.commit('setUser', user);
                runtime.eventBus.emit('login', user);

                cy.wrap(user).as('user');
            });
        });
    },

    spyEngine(): void {
        cy.get<Engine>('@soukaiEngine').then(engine => {
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
    ): void {
        cy.get('@soukaiEngineSpies').then(spies => {
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
