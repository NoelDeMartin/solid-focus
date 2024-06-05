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
import { computed, watchEffect } from 'vue';
import { objectProp, requiredObjectProp } from '@aerogel/core';

import Workspaces from '@/services/Workspaces';
import { bindWorkspaceColors } from '@/utils/composables';
import { WORKSPACE_COLOR_VALUES, WorkspaceColors } from '@/utils/colors';
import type Workspace from '@/models/Workspace';
import type TasksList from '@/models/TasksList';

defineProps({
    workspace: requiredObjectProp<Workspace>(),
    list: objectProp<TasksList>(),
});

const workspaceColors = computed(() => WORKSPACE_COLOR_VALUES[Workspaces.current?.color ?? WorkspaceColors.Blue]);

watchEffect(() => Workspaces.current?.loadRelationIfUnloaded('lists'));
bindWorkspaceColors(workspaceColors);
</script>
