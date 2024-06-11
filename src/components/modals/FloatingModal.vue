<template>
    <AGHeadlessModal
        ref="$modal"
        v-slot="{ close }"
        v-bind="modalProps"
        class="relative z-50"
    >
        <div class="fixed inset-0 z-10 overflow-y-auto">
            <div class="flex min-h-full items-center justify-center p-4 text-center">
                <AGHeadlessModalPanel
                    ref="$panel"
                    class="relative overflow-hidden rounded-xl bg-white p-4 text-left shadow-xl"
                >
                    <AGHeadlessModalTitle v-if="title" class="text-lg font-semibold leading-6 text-gray-900">
                        <AGMarkdown :text="title" inline />
                    </AGHeadlessModalTitle>
                    <AGMarkdown
                        v-if="title && subtitle"
                        :text="subtitle"
                        class="mt-1 text-sm leading-6 text-gray-500"
                    />
                    <div :class="{ 'mt-3': title }">
                        <slot :close="close" />
                    </div>
                </AGHeadlessModalPanel>
            </div>
        </div>
    </AGHeadlessModal>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { extractModalProps, mixedProp, useModalExpose, useModalProps } from '@aerogel/core';
import type { IAGHeadlessModal } from '@aerogel/core';

import type { IFloatingModal } from './FloatingModal';

const props = defineProps({
    ...useModalProps(),
    subtitle: mixedProp(),
});
const $modal = ref<IAGHeadlessModal>();
const $panel = ref<{ $el?: HTMLElement }>();
const modalProps = extractModalProps(props);

defineExpose<IFloatingModal>({
    ...useModalExpose($modal),
    $panel,
});
</script>
