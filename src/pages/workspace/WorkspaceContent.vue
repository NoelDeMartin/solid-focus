<template>
    <div class="flex w-full max-w-screen-xl flex-col overflow-hidden" @click="deselectTask($event)">
        <WorkspaceContentHeader />
        <WorkspaceContentBody v-if="$tasksList.isRelationLoaded('tasks')" class="flex-1" />
        <WorkspaceLoading v-else />
    </div>
</template>

<script setup lang="ts">
import { watchEffect } from 'vue';

import Tasks from '@/services/Tasks';
import TasksLists from '@/services/TasksLists';

function deselectTask(event: MouseEvent) {
    if (!Tasks.current || (event.target instanceof Element && event.target.closest('button, a, input, textarea'))) {
        return;
    }

    Tasks.select(null);
}

watchEffect(() => TasksLists.current?.loadRelationIfUnloaded('tasks'));
</script>
