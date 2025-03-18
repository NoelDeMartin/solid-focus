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
        @enter="emitAfterAnimations('added')"
        @leave="emitAfterAnimations('removed')"
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
import { after } from '@noeldemartin/utils';
import { booleanProp, requiredArrayProp } from '@aerogel/core';
import type { GetClosureArgs } from '@noeldemartin/utils';

import type Task from '@/models/Task';

const emit = defineEmits(['added', 'removed']);

defineProps({
    tasks: requiredArrayProp<Task>(),
    disableEditing: booleanProp(),
});

async function emitAfterAnimations(event: GetClosureArgs<typeof emit>[0]) {
    await after({ ms: 500 });

    emit(event);
}
</script>
