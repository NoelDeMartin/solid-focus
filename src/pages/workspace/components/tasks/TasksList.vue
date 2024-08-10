<template>
    <AGTransitionGroup
        tag="ul"
        class="flex flex-col"
        leave-from-class="h-[46px]"
        leave-active-class="overflow-hidden transition-[height] duration-500 will-change-[height]"
        leave-to-class="h-0"
        enter-from-class="h-0"
        enter-active-class="overflow-hidden transition-[height] duration-500 will-change-[height]"
        enter-to-class="h-[46px]"
        move-class="transition-transform duration-500"
    >
        <TasksListItem
            v-for="task of tasks"
            :key="task.url"
            :task="task"
            :disable-editing="disableEditing"
        />
    </AGTransitionGroup>
</template>

<script setup lang="ts">
import { booleanProp, requiredArrayProp } from '@aerogel/core';

import type Task from '@/models/Task';

defineProps({
    tasks: requiredArrayProp<Task>(),
    disableEditing: booleanProp(),
});
</script>
