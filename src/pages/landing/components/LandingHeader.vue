<template>
    <div
        class="fixed top-0 left-0 z-30 flex h-40 w-full items-center transition-transform"
        :style="{
            transform: `translateY(${showingForm ? '-100%' : '0%'})`,
            'transition-duration': `${FORM_ANIMATION_DURATION}ms`,
        }"
    >
        <LandingSkyImage class="aspect-[4096/376] h-full" />
        <LandingSkyImage class="aspect-[4096/376] h-full" />
    </div>
</template>

<script setup lang="ts">
import { injectOrFail } from '@aerogel/core';

import { FORM_ANIMATION_DURATION } from '@/pages/landing/animations';
import type { LandingContext } from '@/pages/landing/landing';

const { showingForm } = injectOrFail<LandingContext>('landing');
</script>
