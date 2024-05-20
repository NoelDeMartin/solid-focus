<template>
    <div class="flex-1">
        <div
            v-measure="(size: ElementSize) => rootSize = size"
            class="fixed bottom-0 left-0 top-0 flex min-w-56 flex-col shadow-panel transition-transform will-change-transform"
            :class="{
                'translate-x-0': $workspaces.showSidebar,
                '-translate-x-full': !$workspaces.showSidebar,
            }"
        >
            <WorkspaceSidebarHeader />
            <WorkspaceSidebarNav />
        </div>
        <div class="transition-[width]" :style="`width: ${$workspaces.showSidebar ? rootSize?.width : 0}px;`" />
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { ElementSize } from '@aerogel/core';

const rootSize = ref<ElementSize>();
</script>
