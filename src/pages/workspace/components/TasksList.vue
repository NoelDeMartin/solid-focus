<template>
    <RouteTransitionGroup
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
    </RouteTransitionGroup>
</template>

<script setup lang="ts">
import { after } from '@noeldemartin/utils';

import type Task from '@/models/Task';

defineProps<{ tasks: Task[]; disableEditing?: boolean }>();

const emit = defineEmits<{
    added: [];
    removed: [];
}>();

async function emitAfterAnimations(event: 'added' | 'removed') {
    await after({ ms: 500 });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    emit(event as any);
}
</script>
