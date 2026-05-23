import { Events } from '@aerogel/core';
import { facade, getLocationQueryParameter, hasLocationQueryParameter, objectWithout } from '@noeldemartin/utils';
import { Router } from '@aerogel/plugin-routing';
import { Solid } from '@aerogel/plugin-solid';
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

        this.autoLogin();
    }

    protected completeProfile(profile: SolidUserProfile, store: SolidStore): void {
        const trustedApps = store.statements(profile.webId, 'acl:trustedApp');

        profile.usedLegacyApp = trustedApps.some((trustedApp) => {
            const origin = store.statement(trustedApp.object, 'acl:origin');

            return origin?.object.value === 'https://noeldemartin.github.io';
        });
    }

    private async autoLogin(): Promise<void> {
        await Solid.booted;

        if (
            Solid.isLoggedIn() ||
            Solid.wasLoggedIn() ||
            !hasLocationQueryParameter('loginWith') ||
            !Router.currentRoute.value
        ) {
            return;
        }

        const loginUrl = getLocationQueryParameter('loginWith') as string;

        await Router.replace({ query: objectWithout(Router.currentRoute.value.query, ['loginWith']) });
        await Solid.login(loginUrl);
    }

}

export default facade(FocusService);
