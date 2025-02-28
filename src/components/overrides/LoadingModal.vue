<template>
    <FloatingModal :title="title" :cancellable="false">
        <div
            class="flex"
            :class="{ 'flex-col-reverse': showProgress, 'items-center justify-center gap-2': !showProgress }"
        >
            <AGProgressBar v-if="showProgress" class="bg-[--primary-600]" :progress="progress" />
            <i-svg-spinners-ring-resize v-else class="mr-2 h-6 w-6 text-[--primary-600]" />
            <AGMarkdown :text="renderedMessage" />
        </div>
    </FloatingModal>
</template>

<script setup lang="ts">
import { useLoadingModal, useLoadingModalProps } from '@aerogel/core';

const props = defineProps(useLoadingModalProps());
const { renderedMessage, showProgress } = useLoadingModal(props);
</script>
