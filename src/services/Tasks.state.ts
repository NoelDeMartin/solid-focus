import { defineServiceState } from '@aerogel/core';
import type { Nullable } from '@noeldemartin/utils';

import type Task from '@/models/Task';

export default defineServiceState({
    name: 'tasks',
    initialState: () => ({
        current: null as Nullable<Task>,
    }),
});
