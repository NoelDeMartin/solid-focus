<template>
    <FloatingModal :title="title" close-hidden>
        <AGMarkdown :text="message" />
    </FloatingModal>
</template>

<script setup lang="ts">
import { useAlertModalProps } from '@aerogel/core';

defineProps(useAlertModalProps());
</script>
