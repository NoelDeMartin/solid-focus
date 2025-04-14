import { computedModel } from '@aerogel/plugin-soukai';
import { defineServiceState } from '@aerogel/core';
import { Router } from '@aerogel/plugin-routing';
import { shallowReactive } from 'vue';
import type { Key } from 'soukai';

import type Workspace from '@/models/Workspace';

export default defineServiceState({
    name: 'workspaces',
    persist: ['lastVisitedWorkspaceUrl', 'sidebar', 'usingLegacySchemas'],
    initialState: () => ({
        all: shallowReactive([] as Workspace[]),
        sidebar: false,
        current: computedModel(() => {
            const routeParams: { workspace?: Workspace } = Router.currentRoute.value?.params ?? {};

            return routeParams.workspace;
        }),
        lastVisitedWorkspaceUrl: null as Key | null,
        usingLegacySchemas: null as boolean | null,
    }),
});
