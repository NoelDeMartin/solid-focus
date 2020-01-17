import Faker from 'faker';

import { SolidAuthClient } from 'solid-auth-client';

import StubResponse from '@tests/stubs/StubResponse';

describe('Authentication', () => {

    beforeEach(() => {
        cy.visit('/');
    });

    it('Logs in offline', () => {
        cy.start({ useRealEngines: true });

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

        cy.start({ useRealEngines: true });

        cy.get('input[placeholder="Solid POD"]').type(domain);
        cy.contains('Login with Solid').click();

        cy.contains('#app-navigation-drawer', name).should('be.visible');
    });

    it('Gives a warning when logging out offline', () => {
        cy.start({ useRealEngines: true });

        cy.contains('Login Offline').click();

        cy.get('#app-navigation-drawer button[title="Show actions menu"]').click();
        cy.contains('Logout').click();

        cy.contains('.v-dialog', 'Logging out from offline mode will delete all your data')
          .should('be.visible');

        cy.contains('.v-dialog button', 'Logout').click();

        cy.contains('Login Offline').should('be.visible');
        cy.contains('Login with Solid').should('be.visible');
    });

});
