<template>
    <div v-if="$tasksLists.current?.isRelationLoaded('tasks')">
        <WorkspaceContentHeader />
        <WorkspaceContentBody />
    </div>
    <WorkspaceContentLoading v-else-if="$tasksLists.current" />
    <WorkspaceContentMissing v-else />
</template>

<script setup lang="ts">
import { watchEffect } from 'vue';

import TasksLists from '@/services/TasksLists';

watchEffect(() => TasksLists.current?.loadRelationIfUnloaded('tasks'));
</script>
