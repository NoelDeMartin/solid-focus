import SolidAuthClient, { Session } from 'solid-auth-client';
import $rdf from 'rdflib';

import BaseAuth from '@/services/Auth';

export default class Auth extends BaseAuth {

    public async login(idp: string): Promise<void> {
        await SolidAuthClient.login(idp);
    }

    public async logout(): Promise<void> {
        await SolidAuthClient.logout();
    }

    protected async init(): Promise<void> {
        await super.init();

        const onSessionUpdated = this.onSessionUpdated.bind(this);

        await SolidAuthClient.currentSession().then(onSessionUpdated);

        SolidAuthClient.trackSession(onSessionUpdated);
    }

    private async onSessionUpdated(session: Session | void): Promise<void> {
        if (session) {
            await this.loginFromSession(session);
        } else {
            this.logoutUser();
        }
    }

    private async loginFromSession(session: Session): Promise<void> {
        const $VCARD = $rdf.Namespace('http://www.w3.org/2006/vcard/ns#');
        const $FOAF = $rdf.Namespace('http://xmlns.com/foaf/0.1/');

        const store = $rdf.graph();
        const fetcher = new $rdf.Fetcher(store, {});

        await (fetcher as any).load(session.webId);

        const $webId = store.sym(session.webId);

        const $name = store.any($webId, $VCARD('fn'), null as any, null as any)
            || store.any($webId, $FOAF('name'), null as any, null as any);

        const $avatarUrl = store.any($webId, $VCARD('hasPhoto'), null as any, null as any)
                || store.any($webId, $FOAF('image'), null as any, null as any)
                || store.any($webId, $FOAF('img'), null as any, null as any);

        this.loginUser({
            id: $webId.value,
            name: $name ? $name.value : null,
            avatarUrl: $avatarUrl ? $avatarUrl.value : null,
        });
    }

}
