import { computedModel } from '@aerogel/plugin-soukai';
import { defineServiceState } from '@aerogel/core';
import { Router } from '@aerogel/plugin-routing';
import { shallowRef } from 'vue';
import type { Key } from 'soukai';

import type Workspace from '@/models/Workspace';

export default defineServiceState({
    name: 'workspaces',
    persist: ['lastVisitedWorkspaceId'],
    initialState: {
        lastVisitedWorkspaceId: null as Key | null,
        all: shallowRef([] as Workspace[]),
        current: computedModel(() => {
            const routeParams: { workspace?: Workspace } = Router.currentRoute.value?.params ?? {};

            return routeParams.workspace;
        }),
    },
});