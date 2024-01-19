import { defineServiceState } from '@aerogel/core';
import type { Key } from 'soukai';

import Workspaces from '@/services/Workspaces';

export default defineServiceState({
    name: 'tasks-lists',
    persist: ['currentTasksListId'],
    initialState: {
        currentTasksListId: null as Key | null,
    },
    computed: {
        current({ currentTasksListId }) {
            const lists = Workspaces.current?.lists ?? [];

            return lists.find((list) => list.id === currentTasksListId) ?? null;
        },
    },
});
