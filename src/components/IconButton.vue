<template>
    <AGHeadlessButton :class="renderedClasses" :disabled="disabled">
        <slot />
    </AGHeadlessButton>
</template>

<script setup lang="ts">
import { booleanProp, removeInteractiveClasses, stringProp } from '@aerogel/core';
import { computed } from 'vue';
import { twMerge } from 'tailwind-merge';

const props = defineProps({
    class: stringProp(''),
    disabled: booleanProp(),
});

const baseClasses = [
    'clickable-target p-3 flex items-center justify-center rounded-full',
    'hover:bg-gray-100',
    'focus-visible:outline focus-visible:outline-gray-700',
].join(' ');
const variantClasses = computed(() => {
    if (!props.disabled) {
        return baseClasses;
    }

    return `${removeInteractiveClasses(baseClasses)} opacity-50`;
});
const renderedClasses = computed(() => twMerge(variantClasses.value, props.class));
</script>
