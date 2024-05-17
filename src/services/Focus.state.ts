import { defineServiceState } from '@aerogel/core';

export default defineServiceState({
    name: 'focus',
    persist: ['visits'],
    initialState: {
        visits: 0,
    },
});
