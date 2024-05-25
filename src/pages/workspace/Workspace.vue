<template>
    <div class="h-1 w-full bg-[--primary-500]" />
    <WorkspaceCloudSetup v-if="$cloud.setupPending" />
    <div v-else-if="$workspaces.current?.isRelationLoaded('lists')" class="flex w-full flex-grow">
        <WorkspaceSidebar />
        <WorkspaceContent />
        <WorkspaceTask />
    </div>
    <WorkspaceLoading v-else-if="$workspaces.current" />
    <WorkspaceMissing v-else />
</template>

<script setup lang="ts">
import { ref, watchEffect } from 'vue';
import { objectProp, requiredObjectProp } from '@aerogel/core';

import Workspaces from '@/services/Workspaces';
import { bindWorkspaceColors } from '@/utils/composables';
import type Workspace from '@/models/Workspace';
import type TasksList from '@/models/TasksList';

defineProps({
    workspace: requiredObjectProp<Workspace>(),
    list: objectProp<TasksList>(),
});

const workspaceColors = ref({
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
    950: '#450a0a',
});

watchEffect(() => Workspaces.current?.loadRelationIfUnloaded('lists'));
bindWorkspaceColors(workspaceColors);
</script>
