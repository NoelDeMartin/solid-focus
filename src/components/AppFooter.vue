<template>
    <footer class="flex w-full items-center justify-center gap-1 p-3 text-sm text-gray-500">
        <AGLink @click="$ui.openModal(AboutModal)">
            {{ $t('footer.about') }}
        </AGLink>
        <span aria-hidden="true">|</span>
        <AGLink :url="$app.sourceUrl">
            {{ $t('footer.source') }}
        </AGLink>
        <span aria-hidden="true">|</span>
        <AGLink :url="$app.versionUrl">
            {{ $app.versionName }}
        </AGLink>
    </footer>
</template>

<script setup lang="ts">
import AboutModal from './modals/AboutModal.vue';
</script>
