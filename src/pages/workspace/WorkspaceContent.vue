<template>
    <div class="flex w-full max-w-screen-xl flex-col overflow-hidden" @click="deselectTask($event)">
        <WorkspaceContentHeader />
        <WorkspaceContentBody class="flex-1" />
    </div>
</template>

<script setup lang="ts">
import Workspaces from '@/services/Workspaces';

function deselectTask(event: MouseEvent) {
    if (!Workspaces.task || (event.target instanceof Element && event.target.closest('button, a, input, textarea'))) {
        return;
    }

    Workspaces.select(null);
}
</script>
