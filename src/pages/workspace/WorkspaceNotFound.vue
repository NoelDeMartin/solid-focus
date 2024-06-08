<template>
    <div class="flex flex-grow flex-col items-center justify-center">
        <img src="@/assets/img/workspaces/not-found.avif" class="w-96" alt="">
        <AGMarkdown :lang-key="langKey" :lang-params="langParams" class="mt-4 text-2xl" />
    </div>
</template>

<script setup lang="ts">
import { mixedProp, requiredStringProp } from '@aerogel/core';

defineProps({
    langKey: requiredStringProp(),
    langParams: mixedProp(),
});
</script>
