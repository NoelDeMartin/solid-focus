<template>
    <Button
        size="icon"
        variant="ghost"
        :title="$t('errors.viewLogs')"
        :aria-label="$t('errors.viewLogs')"
        @click="$ui.modal(ErrorLogsModal)"
    >
        <i-ion-warning class="size-6 text-red-500" />
    </Button>
</template>

<script setup lang="ts">
import ErrorLogsModal from '../modals/ErrorLogsModal.vue';
</script>
