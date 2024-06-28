<template>
    <div v-if="$workspaces.current && !settingUpCloud" class="h-1 w-full bg-[--primary-500]" />
    <WorkspaceCloudSetup v-if="settingUpCloud" />
    <div v-else-if="$workspaces.current?.isRelationLoaded('lists')" class="isolate flex w-full flex-grow">
        <WorkspaceSidebar />
        <WorkspaceContent />
        <WorkspaceTask />
    </div>
    <WorkspaceLoading v-else-if="$workspaces.current" />
    <WorkspaceNotFound v-else lang-key="workspaces.notFound" :lang-params="{ workspace: $route.params.workspace }" />
</template>

<script setup lang="ts">
import { Cloud } from '@aerogel/plugin-offline-first';
import { computed, watchEffect } from 'vue';
import { objectProp, requiredObjectProp } from '@aerogel/core';
import { Solid } from '@aerogel/plugin-solid';

import Workspaces from '@/services/Workspaces';
import { THEME_COLORS, bindThemeColors } from '@/utils/colors';
import type Workspace from '@/models/Workspace';
import type TasksList from '@/models/TasksList';

defineProps({
    workspace: requiredObjectProp<Workspace>(),
    list: objectProp<TasksList>(),
});

const workspaceColors = computed(() => THEME_COLORS[Workspaces.current?.themeColor ?? 'sky']);
const settingUpCloud = computed(() => Solid.isLoggedIn() && !Cloud.ready && !Cloud.setupDismissed);

watchEffect(() => Workspaces.current?.loadRelationIfUnloaded('lists'));
bindThemeColors(workspaceColors);
</script>
