<template>
    <div class="flex-1">
        <div
            class="fixed top-1 right-0 bottom-0 left-0 z-10 flex"
            :class="{ 'pointer-events-none': $ui.desktop || !$workspaces.sidebar }"
        >
            <div
                v-if="$ui.mobile"
                class="will-change-opacity bg-opacity-75 absolute inset-0 bg-gray-500 opacity-0 transition-opacity duration-500"
                :class="{ 'opacity-100': $workspaces.sidebar, 'opacity-0': !$workspaces.sidebar }"
                @click="$workspaces.toggleSidebar()"
            />
            <div
                ref="$panelRef"
                class="pointer-events-auto hidden h-full min-w-64 -translate-x-full flex-col border-r border-gray-200 bg-white will-change-[translate]"
            >
                <WorkspaceSidebarHeader />
                <WorkspaceSidebarNav />
            </div>
        </div>
        <div
            ref="$fillerRef"
            v-measure.watch="(size: ElementSize) => $ui.desktop && ($focus.footerLeftPadding = size.width)"
            class="hidden md:block"
        />
    </div>
</template>

<script setup lang="ts">
import { onUnmounted, useTemplateRef, watchEffect } from 'vue';
import { UI } from '@aerogel/core';
import type { ElementSize } from '@aerogel/core';

import Focus from '@/services/Focus';
import Workspaces from '@/services/Workspaces';
import { watchKeyboardShortcut } from '@/utils/composables';

import PanelAnimator from '@/pages/workspace/animations/PanelAnimator';

const $panel = useTemplateRef('$panelRef');
const $filler = useTemplateRef('$fillerRef');
const panelAnimator = new PanelAnimator($panel, $filler, 'left');

watchEffect(() => (Workspaces.sidebar ? panelAnimator.show() : panelAnimator.hide()));
watchKeyboardShortcut('Escape', () => UI.mobile && Workspaces.sidebar && Workspaces.toggleSidebar());
onUnmounted(() => (Focus.footerLeftPadding = null));
</script>
