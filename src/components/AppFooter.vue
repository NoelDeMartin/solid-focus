<template>
    <div class="flex w-full">
        <div class="flex-1">
            <div :style="`width: ${$focus.footerLeftPadding ?? 0}px`" />
        </div>
        <footer class="flex w-full max-w-screen-xl items-center justify-center gap-1 p-3 text-sm text-gray-500">
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
        <div class="flex-1">
            <div :style="`width: ${$focus.footerRightPadding ?? 0}px`" />
        </div>
    </div>
</template>

<script setup lang="ts">
import AboutModal from './modals/AboutModal.vue';
</script>
