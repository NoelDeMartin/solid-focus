<template>
    <div class="flex flex-col items-center">
        <h1 class="text-2xl font-semibold">
            {{ workspace.name }}
        </h1>
        <ul class="mt-4 list-disc">
            <li v-for="task of tasks" :key="task.id">
                {{ task.name }}
            </li>
        </ul>
    </div>
</template>

<script setup lang="ts">
import { computedAsync, requiredObjectProp } from '@aerogel/core';

import type Workspace from '@/models/Workspace';

const props = defineProps({
    workspace: requiredObjectProp<Workspace>(),
});

const tasks = computedAsync(async () => {
    await props.workspace.loadRelationIfUnloaded('tasks');

    return props.workspace.tasks ?? [];
});
</script>
