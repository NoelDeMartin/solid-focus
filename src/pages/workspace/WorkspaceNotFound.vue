<template>
    <div class="flex flex-grow flex-col items-center justify-center">
        <img src="@/assets/img/workspaces/not-found.avif" class="w-96" alt="">
        <h1 class="mt-4 text-3xl font-semibold">
            {{ $t('notFound.title') }}
        </h1>
        <AGMarkdown :lang-key="langKey" :lang-params="langParams" class="mt-2 text-lg font-light text-gray-600" />
        <div class="mt-4 flex gap-2">
            <TextButton route="home" class="text-sm">
                {{ $t('notFound.goHome') }}
            </TextButton>
            <TextButton
                v-if="!$solid.hasLoggedIn()"
                color="clear"
                class="text-sm"
                @click="$ui.openModal(CloudLoginModal)"
            >
                {{ $t('notFound.logIn') }}
            </TextButton>
        </div>
    </div>
</template>

<script setup lang="ts">
import { mixedProp, requiredStringProp } from '@aerogel/core';

import CloudLoginModal from './modals/CloudLoginModal.vue';

defineProps({
    langKey: requiredStringProp(),
    langParams: mixedProp(),
});
</script>
