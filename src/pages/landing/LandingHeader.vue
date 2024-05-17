<template>
    <LandingSkyImage
        class="fixed left-0 top-0 z-30 h-40 w-screen transition-transform"
        :style="{
            transform: `translateY(${showingForm ? '-100%' : '0%'})`,
            'animation-duration': `${FORM_ANIMATION_DURATION}ms`,
        }"
    />
</template>

<script setup lang="ts">
import { injectOrFail } from '@aerogel/core';

import { FORM_ANIMATION_DURATION } from './animations';
import type { LandingContext } from './landing';

const { showingForm } = injectOrFail<LandingContext>('landing');
</script>
