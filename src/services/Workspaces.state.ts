import { defineServiceState } from '@aerogel/core';
import type { Key } from 'soukai';

import type Workspace from '@/models/Workspace';

export default defineServiceState({
    name: 'workspaces',
    persist: ['currentWorkspaceId'],
    initialState: {
        currentWorkspaceId: null as Key | null,
        workspaces: [] as Workspace[],
    },
    computed: {
        current: ({ currentWorkspaceId, workspaces }) =>
            workspaces?.find((workspace) => workspace.id === currentWorkspaceId),
    },
});
