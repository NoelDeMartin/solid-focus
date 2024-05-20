<template>
    <div class="flex w-full max-w-screen-xl flex-col">
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

watchEffect(() => TasksLists.current?.loadRelationIfUnloaded('tasks'));
</script>
