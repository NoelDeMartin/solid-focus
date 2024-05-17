<template>
    <div class="flex h-screen flex-col items-center justify-center">
        <AGMarkdown lang-key="landing.callout" class="mt-16 w-full text-center text-2xl font-light" singleline />

        <div ref="$logo" class="z-30 mt-16 flex aspect-[5/2] h-32">
            <i-app-logo class="h-full w-full" />
        </div>

        <div class="z-30 mb-16 mt-8 flex items-center justify-center gap-x-6">
            <button
                type="button"
                class="rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                @click="$events.emit('landing:get-started')"
            >
                {{ $t('landing.getStarted.cta') }}
            </button>
            <button
                type="button"
                class="text-sm font-semibold leading-6 text-gray-900"
                @click="$events.emit('landing:log-in')"
            >
                {{ $t('landing.logIn.cta') }} <span aria-hidden="true">→</span>
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { injectOrFail } from '@aerogel/core';

import { bindRefs, useElementScrollY, useScrollY, useWindowDimensions } from '@/utils/composables';

import type { LandingContext } from './landing';

const $logo = ref<HTMLElement>();
const context = injectOrFail<LandingContext>('landing');
const scrollY = useScrollY();
const calloutScrollY = useElementScrollY($logo);
const windowDimensions = useWindowDimensions();
const showingCallout = computed(
    () => calloutScrollY.value && scrollY.value >= calloutScrollY.value - windowDimensions.value.height,
);

bindRefs(showingCallout, context.showingCallout);
</script>
