<template>
    <FloatingModal v-slot="{ close }" :title="title || message" :cancellable="false">
        <AGMarkdown v-if="title" :text="message" />
        <div class="mt-4 flex flex-row-reverse">
            <TextButton :color="acceptColor" @click="close(true)">
                {{ renderedAcceptText }}
            </TextButton>
            <TextButton :color="cancelColor" class="mr-2" @click="close(false)">
                {{ renderedCancelText }}
            </TextButton>
        </div>
    </FloatingModal>
</template>

<script setup lang="ts">
import { useConfirmModal, useConfirmModalProps } from '@aerogel/core';

const props = defineProps(useConfirmModalProps());
const { renderedAcceptText, renderedCancelText } = useConfirmModal(props);
</script>
