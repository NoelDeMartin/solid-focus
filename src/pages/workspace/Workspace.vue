<template>
    <div v-if="$workspaces.current && !settingUpCloud" class="bg-primary-500 fixed top-0 z-10 h-1 w-full" />
    <WorkspaceCloudSetup v-if="settingUpCloud" />
    <WorkspaceCloudMigrate v-else-if="migratingCloud" />
    <div
        v-else-if="$workspaces.current?.isRelationLoaded('lists') && $tasksLists.current"
        class="isolate flex w-full grow"
    >
        <WorkspaceSidebar />
        <WorkspaceContent />
        <WorkspaceTask />
    </div>
    <WorkspaceLoading v-else-if="$workspaces.current && $tasksLists.current" />
    <WorkspaceNotFound
        v-else-if="$workspaces.current"
        lang-key="lists.notFound"
        :lang-params="{ list: $route.params.list as string }"
    />
    <WorkspaceNotFound
        v-else
        lang-key="workspaces.notFound"
        :lang-params="{ workspace: $route.params.workspace as string }"
    />
</template>

<script setup lang="ts">
import { Cloud } from '@aerogel/plugin-local-first';
import { computed, watchEffect } from 'vue';
import { Solid } from '@aerogel/plugin-solid';

import Workspaces from '@/services/Workspaces';
import { DEFAULT_COLOR, clearThemeVariables, setThemeVariables } from '@/utils/theme';
import type Workspace from '@/models/Workspace';
import type TasksList from '@/models/TasksList';

defineProps<{
    workspace?: Workspace;
    list?: TasksList;
}>();

const workspaceColor = computed(() => Workspaces.current?.color ?? DEFAULT_COLOR);
const settingUpCloud = computed(() => {
    if (Cloud.setupOngoing) {
        return true;
    }

    return Solid.isLoggedIn() && !Cloud.ready && !Cloud.setupDismissed;
});
const migratingCloud = computed(() => {
    if (!Solid.isLoggedIn() || !Cloud.ready || Cloud.migrationPostponed) {
        return false;
    }

    if (Cloud.migrating || Cloud.migrationJob) {
        return true;
    }

    return Cloud.shouldMigrate() && !Cloud.migrationDismissed;
});

watchEffect(() => Workspaces.current?.loadRelationIfUnloaded('lists'));
watchEffect((onCleanup) => {
    setThemeVariables(document.documentElement, workspaceColor.value);
    onCleanup(() => clearThemeVariables(document.documentElement));
});
</script>
