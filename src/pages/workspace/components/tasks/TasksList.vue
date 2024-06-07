<template>
    <div>
        <ul class="flex flex-col gap-0.5">
            <TasksListItem
                v-for="task of tasks"
                :key="task.url"
                :task="task"
                :disable-editing="disableEditing"
            />
        </ul>
    </div>
</template>

<script setup lang="ts">
import { booleanProp, requiredArrayProp } from '@aerogel/core';

import type Task from '@/models/Task';

defineProps({
    tasks: requiredArrayProp<Task>(),
    disableEditing: booleanProp(),
});
</script>
