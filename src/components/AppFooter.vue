<template>
    <footer class="flex w-full items-center justify-center gap-1 p-3 text-sm text-gray-500">
        <TextLink @click="$ui.openModal(AboutModal)">
            {{ $t('footer.about') }}
        </TextLink>
        <span aria-hidden="true">|</span>
        <TextLink :url="$app.sourceUrl">
            {{ $t('footer.source') }}
        </TextLink>
        <span aria-hidden="true">|</span>
        <TextLink :url="$app.versionUrl">
            {{ $app.versionName }}
        </TextLink>
    </footer>
</template>

<script setup lang="ts">
import AboutModal from './modals/AboutModal.vue';
</script>
