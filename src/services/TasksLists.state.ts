import { defineServiceState } from '@aerogel/core';
import { Router } from '@aerogel/plugin-routing';
import type { Key } from 'soukai';

import type TasksList from '@/models/TasksList';
import type Workspace from '@/models/Workspace';

export default defineServiceState({
    name: 'tasks-lists',
    persist: ['lastVisitedListId'],
    initialState: {
        lastVisitedListId: null as Key | null,
    },
    computed: {
        current() {
            const routeParams: { workspace?: Workspace; list?: TasksList } = Router.currentRoute.value?.params ?? {};

            return routeParams.list ?? routeParams.workspace?.lists?.[0];
        },
    },
});
