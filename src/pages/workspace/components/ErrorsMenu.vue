<template>
    <IconButton
        :title="$t('errors.viewLogs')"
        :aria-label="$t('errors.viewLogs')"
        @click="$ui.openModal(ErrorLogsModal)"
    >
        <i-ion-warning class="h-6 w-6 text-red-500" />
    </IconButton>
</template>

<script setup lang="ts">
import ErrorLogsModal from '../modals/ErrorLogsModal.vue';
</script>
