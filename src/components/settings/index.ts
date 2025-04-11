import { defineSettings } from '@aerogel/core';

import Migrate from './Migrate.vue';

export default defineSettings([
    {
        component: Migrate,
        priority: 50,
    },
]);
