import { defineServiceState } from '@aerogel/core';
import { Router } from '@aerogel/plugin-routing';
import type { Key } from 'soukai';

import type Workspace from '@/models/Workspace';

export default defineServiceState({
    name: 'workspaces',
    persist: ['lastVisitedWorkspaceId'],
    initialState: {
        lastVisitedWorkspaceId: null as Key | null,
        all: [] as Workspace[],
    },
    computed: {
        current: () => Router.currentRoute.value?.params.workspace as Workspace | null,
    },
});
