<template>
    <WorkspaceCloudSetup v-if="$cloud.setupPending" />
    <div v-else-if="$workspaces.current?.isRelationLoaded('lists')" class="flex w-full flex-grow">
        <WorkspaceSidebar />
        <WorkspaceContent class="flex-1" />
    </div>
    <WorkspaceLoading v-else-if="$workspaces.current" />
    <WorkspaceMissing v-else />
</template>

<script setup lang="ts">
import { watchEffect } from 'vue';

import Workspaces from '@/services/Workspaces';

watchEffect(() => Workspaces.current?.loadRelationIfUnloaded('lists'));
</script>
