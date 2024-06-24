<template>
    <AGHeadlessButton :class="renderedClasses">
        <slot />
    </AGHeadlessButton>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { stringProp } from '@aerogel/core';
import { twMerge } from 'tailwind-merge';

const props = defineProps({ class: stringProp('') });
const baseClasses = 'font-medium hover:underline focus-visible:underline focus-visible:outline-none';
const renderedClasses = computed(() => twMerge(baseClasses, props.class));
</script>
