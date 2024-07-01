<template>
    <div class="flex-1">
        <div
            class="fixed bottom-0 left-0 right-0 top-1 z-10 flex"
            :class="{ 'pointer-events-none': $ui.desktop || !$workspaces.sidebar }"
        >
            <div
                v-if="$ui.mobile"
                class="will-change-opacity absolute inset-0 bg-gray-500 bg-opacity-75 opacity-0 transition-opacity duration-500"
                :class="{ 'opacity-100': $workspaces.sidebar, 'opacity-0': !$workspaces.sidebar }"
                @click="$workspaces.toggleSidebar()"
            />
            <div
                ref="$panel"
                class="pointer-events-auto hidden h-full min-w-64 -translate-x-full flex-col border-r bg-white will-change-transform"
            >
                <WorkspaceSidebarHeader />
                <WorkspaceSidebarNav />
            </div>
        </div>
        <div ref="$filler" class="hidden md:block" />
    </div>
</template>

<script setup lang="ts">
import { ref, watchEffect } from 'vue';
import { UI } from '@aerogel/core';

import Workspaces from '@/services/Workspaces';
import { watchKeyboardShortcut } from '@/utils/composables';

import { PanelAnimator } from './animations';

const $panel = ref<HTMLElement>();
const $filler = ref<HTMLElement>();
const panelAnimator = new PanelAnimator($panel, $filler, 'left');

watchEffect(() => (Workspaces.sidebar ? panelAnimator.show() : panelAnimator.hide()));
watchKeyboardShortcut('Escape', () => UI.mobile && Workspaces.sidebar && Workspaces.toggleSidebar());
</script>
