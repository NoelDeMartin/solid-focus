<template>
    <div class="flex-1">
        <aside
            v-measure="(size: ElementSize) => rootSize = size"
            class="fixed bottom-0 right-0 top-0 min-w-96 p-8 shadow-panel transition-transform will-change-transform"
            :class="{
                'translate-x-0': task,
                'translate-x-full': !task,
            }"
        >
            <template v-if="task">
                <h2 class="max-w-80 text-lg font-semibold">
                    {{ task.name }}
                </h2>
            </template>
        </aside>
        <div class="transition-[width]" :style="`width: ${task ? rootSize?.width : 0}px;`" />
    </div>
</template>

<script setup lang="ts">
import { computedModel } from '@aerogel/plugin-soukai';
import { ref } from 'vue';
import type { ElementSize } from '@aerogel/core';

import Workspaces from '@/services/Workspaces';

const rootSize = ref<ElementSize>();
const task = computedModel(() => Workspaces.task);
</script>
