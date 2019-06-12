import Faker from 'faker';

import { SolidAuthClient } from 'solid-auth-client';

import StubResponse from '@tests/stubs/StubResponse';

describe('Authentication', () => {

    beforeEach(() => {
        cy.visit('/');
    });

    it('Logs in offline', () => {
        cy.start();

        cy.contains('Login Offline').click();

        cy.contains('#app-navigation-drawer', 'Local (offline)').should('be.visible');
    });

    it('Logs in with Solid', () => {
        const domain = 'example.org';
        const name = Faker.name.firstName() + ' ' + Faker.name.lastName();
        const session = {
            idp: 'https://' + domain,
            webId: 'https://' + domain + '/me',
            accessToken: 'accessToken',
            idToken: 'idToken',
            clientId: 'clientId',
            sessionKey: 'sessionKey',
        };

        cy.require<SolidAuthClient>('solid-auth-client')
            .then(SolidAuthClient => {
                let sessionListener: Function;

                cy.stub(SolidAuthClient, 'trackSession', listener => sessionListener = listener);
                cy.stub(SolidAuthClient, 'login', (url) => {
                    if (url === 'https://' + domain) {
                        sessionListener(session);
                    }
                });
                cy.stub(SolidAuthClient, 'fetch')
                    .withArgs(session.webId)
                    .resolves(StubResponse.success(`
                        @prefix foaf: <http://xmlns.com/foaf/0.1/> .
                        <${session.webId}> foaf:name "${name}" .
                    `));
            });

        cy.start();

        cy.get('input[placeholder="Solid POD"]').type(domain);
        cy.contains('Login').click();

        cy.contains('#app-navigation-drawer', name).should('be.visible');
    });

});
