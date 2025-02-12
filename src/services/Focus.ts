import { facade } from '@noeldemartin/utils';
import { Events } from '@aerogel/core';
import type { SolidStore, SolidUserProfile } from '@noeldemartin/solid-utils';

import Service from './Focus.state';

declare module '@noeldemartin/solid-utils' {
    export interface SolidUserProfile {
        usedLegacyApp?: boolean;
    }
}

export class FocusService extends Service {

    public toggleCompleted(): void {
        this.showCompleted = !this.showCompleted;
    }

    protected async boot(): Promise<void> {
        this.visits++;

        Events.on('solid:user-profile-loaded', ([profile, store]) => this.completeProfile(profile, store));
    }

    protected completeProfile(profile: SolidUserProfile, store: SolidStore): void {
        const trustedApps = store.statements(profile.webId, 'acl:trustedApp');

        profile.usedLegacyApp = trustedApps.some((trustedApp) => {
            const origin = store.statement(trustedApp.object, 'acl:origin');

            return origin?.object.value === 'https://noeldemartin.github.io';
        });
    }

}

export default facade(FocusService);
