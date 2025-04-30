<template>
    <LandingSkyImage
        class="fixed top-0 left-0 z-30 h-40 w-full transition-transform"
        :style="{
            transform: `translateY(${showingForm ? '-100%' : '0%'})`,
            'transition-duration': `${FORM_ANIMATION_DURATION}ms`,
        }"
    />
</template>

<script setup lang="ts">
import { injectOrFail } from '@aerogel/core';

import { FORM_ANIMATION_DURATION } from './animations';
import type { LandingContext } from './landing';

const { showingForm } = injectOrFail<LandingContext>('landing');
</script>
