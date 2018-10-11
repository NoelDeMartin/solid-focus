import SolidAuthClient from 'solid-auth-client';

import Reactive from '@/utils/Reactive';

interface Data {
    webId: string | null;
    idp: string | null;
}

class Auth {

    private data: Data = Reactive.object({
        webId: null,
        idp: null,
    });

    public get loggedIn(): boolean {
        return this.data.webId !== null;
    }

    public get webId(): string {
        return this.data.webId as string;
    }

    public get idp(): string {
        return this.data.idp as string;
    }

    public async init(): Promise<void> {
        return SolidAuthClient.trackSession(session => {
            if (session) {
                this.data.webId = session.webId;
                this.data.idp = session.idp;
            } else {
                this.data.webId = null;
                this.data.idp = null;
            }
        });
    }

    public async login(idp: string): Promise<void> {
        await SolidAuthClient.login(idp);
    }

    public async logout(): Promise<void> {
        await SolidAuthClient.logout();
    }

}

export default new Auth();
