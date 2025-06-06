<template>
    <div
        class="animate-sky-drift fixed top-0 left-0 z-30 flex h-40 w-full items-center transition-transform"
        :style="{
            transform: `translate(var(--translate-sky-x), ${showingForm ? '-100%' : '0%'})`,
            'transition-duration': `${FORM_ANIMATION_DURATION}ms`,
        }"
    >
        <LandingSkyImage v-for="i in 6" :key="i" class="aspect-[1536/300] h-full" />
    </div>
</template>

<script setup lang="ts">
import { injectOrFail } from '@aerogel/core';

import { FORM_ANIMATION_DURATION } from '@/pages/landing/animations';
import type { LandingContext } from '@/pages/landing/landing';

const { showingForm } = injectOrFail<LandingContext>('landing');
</script>

<style>
@property --translate-sky-x {
    syntax: '<percentage>';
    initial-value: 0%;
    inherits: false;
}

@keyframes sky-drift {
    0% {
        --translate-sky-x: 0%;
    }
    50% {
        --translate-sky-x: -50%;
    }
    100% {
        --translate-sky-x: 0%;
    }
}

.animate-sky-drift {
    animation: sky-drift 120s linear infinite;
}
</style>
