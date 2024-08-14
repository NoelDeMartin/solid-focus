<template>
    <div class="flex w-full flex-grow flex-col items-center justify-center p-8">
        <div class="relative aspect-[5/2] h-24">
            <span class="absolute -right-4 top-5 rotate-12 text-xl font-bold text-red-700">{{ $t('beta.tag') }}</span>
            <i-app-logo class="h-full w-full" />
        </div>
        <div v-if="content === 'initial'">
            <h2 class="mt-6 text-xl font-semibold leading-6 text-gray-900">
                {{ $t('beta.title') }}
            </h2>
            <AGMarkdown lang-key="beta.message" class="mt-4 font-light text-gray-600" />
            <div class="mt-8 flex items-center justify-center gap-2">
                <TextButton class="px-3.5 py-2.5 text-sm font-semibold" @click="content = 'get-started'">
                    {{ $t('landing.getStarted.cta') }}
                </TextButton>
                <TextButton color="clear" class="px-3.5 py-2.5 text-sm font-semibold" @click="content = 'log-in'">
                    <span>{{ $t('landing.logIn.cta') }}</span>
                    <i-zondicons-arrow-right class="ml-1.5 h-3 w-3" />
                </TextButton>
            </div>
        </div>
        <LandingGetStarted v-else-if="content === 'get-started'" />
        <LandingLogIn v-else-if="content === 'log-in'" />
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Solid } from '@aerogel/plugin-solid';
import { useEvent } from '@aerogel/core';

import Workspaces from '@/services/Workspaces';

const content = ref<'initial' | 'get-started' | 'log-in'>(Solid.hasLoggedIn() ? 'get-started' : 'initial');

useEvent('landing:reset', () => (content.value = 'initial'));
useEvent('cloud:sync-completed', () => Workspaces.open());
</script>
