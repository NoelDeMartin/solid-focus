<template>
    <div class="flex-1">
        <div
            v-measure="(size: ElementSize) => rootSize = size"
            class="fixed bottom-0 left-0 top-1 z-10 flex min-w-64 flex-col border-r transition-transform will-change-transform"
            :class="{
                'translate-x-0': $workspaces.sidebar,
                '-translate-x-full': !$workspaces.sidebar,
            }"
        >
            <WorkspaceSidebarHeader />
            <WorkspaceSidebarNav />
        </div>
        <div class="transition-[width]" :style="`width: ${$workspaces.sidebar ? rootSize?.width : 0}px;`" />
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { ElementSize } from '@aerogel/core';

const rootSize = ref<ElementSize>();
</script>
