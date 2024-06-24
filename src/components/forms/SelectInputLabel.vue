<template>
    <ListboxLabel :class="renderedClass">
        <slot />
    </ListboxLabel>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { stringProp } from '@aerogel/core';
import { twMerge } from 'tailwind-merge';

const baseClasses = 'text-sm font-medium leading-6 text-gray-900';
const props = defineProps({ class: stringProp() });
const renderedClass = computed(() => twMerge(baseClasses, props.class));
</script>
