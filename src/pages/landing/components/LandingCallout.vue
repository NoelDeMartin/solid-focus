<template>
    <div
        :class="[
            'flex h-screen flex-col items-center justify-center transition-opacity duration-1000',
            show ? 'opacity-100' : 'opacity-0',
        ]"
    >
        <Markdown lang-key="landing.callout" class="mt-16 w-full px-8 text-center text-2xl font-light" />

        <div
            ref="$logoRef"
            v-intersect="(visible: boolean) => after(700).then(() => (show ||= visible))"
            class="z-30 mt-8 flex aspect-5/2 h-32 md:mt-16"
        >
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
import { after } from '@noeldemartin/utils';
import { computed, ref, useTemplateRef } from 'vue';
import { injectOrFail } from '@aerogel/core';

import { bindRefs, useElementScrollY, useScrollY, useWindowDimensions } from '@/utils/composables';

import type { LandingContext } from '@/pages/landing/landing';

const $logo = useTemplateRef('$logoRef');
const show = ref(false);
const context = injectOrFail<LandingContext>('landing');
const scrollY = useScrollY();
const calloutScrollY = useElementScrollY($logo);
const windowDimensions = useWindowDimensions();
const showingCallout = computed(
    () => calloutScrollY.value && scrollY.value >= calloutScrollY.value - windowDimensions.value.height,
);

bindRefs(showingCallout, context.showingCallout);
</script>
