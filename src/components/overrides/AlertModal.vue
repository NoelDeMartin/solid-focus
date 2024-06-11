<template>
    <FloatingModal :title="title">
        <AGMarkdown :text="message" />
    </FloatingModal>
</template>

<script setup lang="ts">
import { useAlertModalProps } from '@aerogel/core';

defineProps(useAlertModalProps());
</script>
