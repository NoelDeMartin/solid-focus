<template>
    <FloatingModal :cancellable="false">
        <div class="flex items-center">
            <i-svg-spinners-ring-resize class="mr-2 h-6 w-6 text-[--primary-600]" />
            <AGMarkdown :text="renderedMessage" />
        </div>
    </FloatingModal>
</template>

<script setup lang="ts">
import { useLoadingModal, useLoadingModalProps } from '@aerogel/core';

const props = defineProps(useLoadingModalProps());
const { renderedMessage } = useLoadingModal(props);
</script>
