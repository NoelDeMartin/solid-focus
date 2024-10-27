import { defineServiceState } from '@aerogel/core';

export default defineServiceState({
    name: 'focus',
    persist: ['visits', 'showCompleted'],
    initialState: {
        visits: 0,
        showCompleted: false,
        footerRightPadding: null as number | null,
        footerLeftPadding: null as number | null,
    },
});
