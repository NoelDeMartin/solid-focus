import SolidAuthClient, { Session } from 'solid-auth-client';
import $rdf from 'rdflib';

import User from '@/models/solid/User';

import BaseAuth from '@/services/Auth';

export default class Auth extends BaseAuth<User> {

    public async login(idp: string): Promise<void> {
        // TODO error not handled
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
        const VCARD = $rdf.Namespace('http://www.w3.org/2006/vcard/ns#');
        const FOAF = $rdf.Namespace('http://xmlns.com/foaf/0.1/');
        const PIM = $rdf.Namespace('http://www.w3.org/ns/pim/space#');

        const store = $rdf.graph();
        const fetcher = new $rdf.Fetcher(store, {});

        await (fetcher as any).load(session.webId);

        const webId = store.sym(session.webId);

        const name = store.any(webId, VCARD('fn'), null as any, null as any)
            || store.any(webId, FOAF('name'), null as any, null as any);

        const avatarUrl = store.any(webId, VCARD('hasPhoto'), null as any, null as any)
                || store.any(webId, FOAF('image'), null as any, null as any)
                || store.any(webId, FOAF('img'), null as any, null as any);

        const storages = store.each(webId, PIM('storage'), null as any, null as any);

        this.loginUser(new User(
            webId.value,
            name ? name.value : null,
            avatarUrl ? avatarUrl.value : null,
            session.idp,
            (storages || []).map($storage => $storage.value),
        ));
    }

}
