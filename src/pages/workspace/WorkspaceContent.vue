<template>
    <div class="flex w-full max-w-screen-xl flex-col" @click="hideActiveTask($event)">
        <template v-if="$tasksLists.current?.isRelationLoaded('tasks')">
            <WorkspaceContentHeader />
            <WorkspaceContentBody class="flex-1" />
        </template>
        <WorkspaceContentLoading v-else-if="$tasksLists.current" />
        <WorkspaceContentMissing v-else />
    </div>
</template>

<script setup lang="ts">
import { watchEffect } from 'vue';

import TasksLists from '@/services/TasksLists';
import Workspaces from '@/services/Workspaces';

function hideActiveTask(event: MouseEvent) {
    if (event.target instanceof Element && event.target.closest('button, a, input, textarea')) {
        return;
    }

    Workspaces.hideActiveTask();
}

watchEffect(() => TasksLists.current?.loadRelationIfUnloaded('tasks'));
</script>
