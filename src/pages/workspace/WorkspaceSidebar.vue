<template>
    <div class="flex-1">
        <div
            ref="$panel"
            class="fixed bottom-0 left-0 top-1 z-10 hidden min-w-64 -translate-x-full flex-col border-r will-change-transform"
        >
            <WorkspaceSidebarHeader />
            <WorkspaceSidebarNav />
        </div>
        <div ref="$filler" />
    </div>
</template>

<script setup lang="ts">
import { ref, watchEffect } from 'vue';

import Workspaces from '@/services/Workspaces';

import { hidePanel, showPanel } from './animations';

const $panel = ref<HTMLElement>();
const $filler = ref<HTMLElement>();

watchEffect(() => (Workspaces.sidebar ? showPanel($panel, $filler, 'left') : hidePanel($panel, $filler, 'left')));
</script>
