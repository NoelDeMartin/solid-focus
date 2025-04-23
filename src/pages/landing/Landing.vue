<template>
    <Markdown v-if="$cloud.syncing" lang-key="landing.syncing" />

    <div
        v-else
        class="isolate"
        :class="{
            'h-screen overflow-hidden': scrollLocked,
            'pointer-events-none': !ready,
        }"
    >
        <LandingHeader />
        <LandingHero />
        <div class="relative z-20 bg-linear-to-b from-[#dedbd3] to-white pt-28">
            <LandingFeatures />
            <LandingCallout />
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, provide, ref } from 'vue';
import { Solid } from '@aerogel/plugin-solid';
import { useEvent } from '@aerogel/core';

import Workspaces from '@/services/Workspaces';

import type { LandingContext } from './landing';

const context: LandingContext = {
    featuresScrollY: ref(0),
    showingForm: ref(Solid.hasLoggedIn()),
    showingCallout: ref(false),
};
const ready = ref(false);
const scrollLocked = computed(() => !ready.value || context.showingForm.value);

provide('landing', context);
useEvent('landing:ready', () => (ready.value = true));
useEvent('cloud:sync-completed', () => Workspaces.open());
</script>
