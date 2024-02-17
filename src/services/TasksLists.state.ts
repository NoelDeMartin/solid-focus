import { computedModel } from '@aerogel/plugin-soukai';
import { defineServiceState } from '@aerogel/core';
import { Router } from '@aerogel/plugin-routing';
import type { Key } from 'soukai';

import type TasksList from '@/models/TasksList';
import type Workspace from '@/models/Workspace';

export default defineServiceState({
    name: 'tasks-lists',
    persist: ['lastVisitedListUrl'],
    initialState: () => ({
        current: computedModel(() => {
            const rawParams: { workspace?: string; list?: string } = Router.currentRoute.value?.rawParams ?? {};
            const params: { workspace?: Workspace; list?: TasksList } = Router.currentRoute.value?.params ?? {};

            if (!params.list && rawParams.list) {
                return null;
            }

            return params.list ?? params.workspace;
        }),
        lastVisitedListUrl: null as Key | null,
    }),
});
