<template>
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
import { watchEffect } from 'vue';

import Workspaces from '@/services/Workspaces';

watchEffect(() => Workspaces.current?.loadRelationIfUnloaded('lists'));
</script>

<style>
:root {
    --primary: #3b82f6;
    --primary-100: #dbeafe;
}
</style>
