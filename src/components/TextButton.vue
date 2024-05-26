<template>
    <AGHeadlessButton :class="renderedClasses" :disabled="disabled">
        <slot />
    </AGHeadlessButton>
</template>

<script setup lang="ts">
import { Colors, booleanProp, enumProp, removeInteractiveClasses, stringProp } from '@aerogel/core';
import { computed } from 'vue';
import { twMerge } from 'tailwind-merge';

const props = defineProps({
    class: stringProp(''),
    color: enumProp(Colors, Colors.Primary),
    disabled: booleanProp(),
});

const baseClasses = 'clickable-target flex items-center justify-center rounded-xl px-3 py-2 focus-visible:outline';
const colorClasses = computed(() => {
    switch (props.color) {
        case Colors.Secondary:
            return '';
        case Colors.Clear:
            return 'hover:bg-gray-100 focus-visible:outline-gray-700';
        case Colors.Danger:
            return '';
        case Colors.Primary:
        default:
            return [
                'bg-[--primary-600] text-white shadow-sm',
                'hover:bg-[--primary-500]',
                'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[--primary-600]',
            ].join(' ');
    }
});
const variantClasses = computed(() => {
    const classes = `${colorClasses.value} ${baseClasses}`;

    if (!props.disabled) {
        return classes;
    }

    return `${removeInteractiveClasses(classes)} opacity-50`;
});
const renderedClasses = computed(() => twMerge(variantClasses.value, props.class));
</script>
