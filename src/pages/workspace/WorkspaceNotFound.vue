<template>
    <div class="relative isolate flex w-full flex-grow items-center justify-center p-8">
        <WorkspaceNotFoundBackground class="absolute inset-0" />
        <div class="relative z-10 rounded-lg bg-white/75 p-8 text-center">
            <h1 class="text-4xl font-semibold">
                {{ $t('notFound.title') }}
            </h1>
            <AGMarkdown :lang-key="langKey" :lang-params="langParams" class="mt-4 text-xl text-gray-600" />
            <div class="mt-4 flex justify-center gap-2">
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
