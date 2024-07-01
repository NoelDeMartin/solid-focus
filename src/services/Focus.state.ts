import { defineServiceState } from '@aerogel/core';

export default defineServiceState({
    name: 'focus',
    persist: ['visits'],
    initialState: {
        visits: 0,
        footerRightPadding: null as number | null,
        footerLeftPadding: null as number | null,
    },
});
