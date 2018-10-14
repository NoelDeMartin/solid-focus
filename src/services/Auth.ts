import SolidAuthClient, { Session } from 'solid-auth-client';
import $rdf from 'rdflib';

import Service from '@/services/Service';

import Reactive from '@/utils/Reactive';

interface Data {
    session: Session | null;
    profile: Profile | null;
}

interface Profile {
    id: string;
    name: string | null;
    avatarUrl: string | null;
}

export default class Auth extends Service {

    private data: Data = Reactive.object({
        session: null,
        profile: null,
    });

    protected async init(): Promise<void> {
        const onSessionUpdated = this.onSessionUpdated.bind(this);

        await SolidAuthClient.currentSession().then(onSessionUpdated);

        SolidAuthClient.trackSession(onSessionUpdated);
    }

    public get loggedIn(): boolean {
        return this.data.session !== null
            && this.data.profile !== null;
    }

    public get profile(): Profile {
        return this.data.profile as Profile;
    }

    public async login(idp: string): Promise<void> {
        await SolidAuthClient.login(idp);
    }

    public async logout(): Promise<void> {
        await SolidAuthClient.logout();
    }

    private async onSessionUpdated(session: Session | void): Promise<void> {
        if (session) {
            this.data.session = session;

            await this.loadProfile(session);
        } else {
            this.data.session = null;
            this.data.profile = null;
        }
    }

    private async loadProfile(session: Session): Promise<void> {
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

        this.data.profile = {
            id: $webId.value,
            name: $name ? $name.value : null,
            avatarUrl: $avatarUrl ? $avatarUrl.value : null,
        };
    }

}
