<template>
    <div class="flex w-full">
        <div class="flex-1">
            <div :style="`width: ${$focus.footerLeftPadding ?? 0}px`" />
        </div>
        <footer class="flex w-full max-w-(--breakpoint-xl) items-center justify-center gap-1 p-3 text-sm text-gray-500">
            <Link class="text-gray-500" @click="$ui.modal(AboutModal)">
                {{ $t('footer.about') }}
            </Link>
            <span aria-hidden="true">|</span>
            <Link :url="$app.sourceUrl" class="text-gray-500">
                {{ $t('footer.source') }}
            </Link>
            <span aria-hidden="true">|</span>
            <Link :url="$app.versionUrl" class="text-gray-500">
                {{ $app.versionName }}
            </Link>
        </footer>
        <div class="flex-1">
            <div :style="`width: ${$focus.footerRightPadding ?? 0}px`" />
        </div>
    </div>
</template>

<script setup lang="ts">
import AboutModal from './modals/AboutModal.vue';
</script>
