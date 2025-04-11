<template>
    <div class="flex h-screen flex-col items-center justify-center">
        <Markdown lang-key="landing.callout" class="mt-16 w-full text-center text-2xl font-light" singleline />

        <div ref="$logoRef" class="z-30 mt-16 flex aspect-5/2 h-32">
            <i-app-logo class="size-full" />
        </div>

        <div class="z-30 mt-8 mb-16 flex items-center justify-center gap-x-3">
            <Button class="px-3.5 py-2.5 text-sm font-semibold" @click="$events.emit('landing:get-started')">
                {{ $t('landing.getStarted.cta') }}
            </Button>
            <Button variant="ghost" class="px-3.5 py-2.5 text-sm font-semibold" @click="$events.emit('landing:log-in')">
                <span>{{ $t('landing.logIn.cta') }}</span>
                <i-zondicons-arrow-right class="ml-1.5 size-3" />
            </Button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, useTemplateRef } from 'vue';
import { injectOrFail } from '@aerogel/core';

import { bindRefs, useElementScrollY, useScrollY, useWindowDimensions } from '@/utils/composables';

import type { LandingContext } from './landing';

const $logo = useTemplateRef('$logoRef');
const context = injectOrFail<LandingContext>('landing');
const scrollY = useScrollY();
const calloutScrollY = useElementScrollY($logo);
const windowDimensions = useWindowDimensions();
const showingCallout = computed(
    () => calloutScrollY.value && scrollY.value >= calloutScrollY.value - windowDimensions.value.height,
);

bindRefs(showingCallout, context.showingCallout);
</script>
