<template>
    <div class="flex w-full max-w-screen-xl flex-col overflow-hidden" @click="deselectTask($event)">
        <template v-if="$tasksLists.current?.isRelationLoaded('tasks')">
            <WorkspaceContentHeader />
            <WorkspaceContentBody class="flex-1" />
        </template>
        <WorkspaceLoading v-else-if="$tasksLists.current" />
        <WorkspaceNotFound v-else lang-key="lists.notFound" :lang-params="{ list: $route.params.list }" />
    </div>
</template>

<script setup lang="ts">
import { watchEffect } from 'vue';

import TasksLists from '@/services/TasksLists';
import Workspaces from '@/services/Workspaces';

function deselectTask(event: MouseEvent) {
    if (!Workspaces.task || (event.target instanceof Element && event.target.closest('button, a, input, textarea'))) {
        return;
    }

    Workspaces.select(null);
}

watchEffect(() => TasksLists.current?.loadRelationIfUnloaded('tasks'));
</script>
