<template>
    <div ref="$root" v-bind="$attrs" :style="rootStyles">
        <slot />
    </div>

    <div v-if="placeholderStyles" :style="placeholderStyles" />
</template>

<script setup lang="ts">
import { booleanProp, enumProp, mixedProp, numberProp } from '@aerogel/core';
import { clamp } from '@noeldemartin/utils';
import { computed, ref, watchEffect } from 'vue';

import { useScrollY, useWindowDimensions } from '@/utils/composables';

import { Fills } from './ScrollTransition';
import type { ScrollTransitionExposed } from './ScrollTransition';

interface Rect {
    x: number;
    y: number;
    width: number;
    height: number;
}

interface Measurements {
    start: Rect;
    end: Rect;
}

defineOptions({ inheritAttrs: false });

const props = defineProps({
    appear: booleanProp(false),
    disabled: booleanProp(false),
    disappear: booleanProp(false),
    end: numberProp(document.body.scrollHeight),
    fill: enumProp(Fills, Fills.None),
    morphTo: mixedProp<HTMLElement | undefined>(),
    start: numberProp(1),
    style: mixedProp(),
});

const $root = ref<HTMLElement>();
const measurements = ref<Measurements>();
const windowDimensions = useWindowDimensions();
const scrollY = useScrollY();
const isActive = computed(() => {
    if (props.disabled) {
        return false;
    }

    if (scrollY.value < props.start && (props.fill === Fills.None || props.fill === Fills.Forwards)) {
        return false;
    }

    if (scrollY.value > props.end && props.fill === Fills.None) {
        return false;
    }

    return true;
});
const rootStyles = computed(() => {
    if (!isActive.value) {
        return props.style;
    }

    const transforms: string[] = [];
    const styles: Record<string, string> = {};
    const progress = (clamp(scrollY.value, props.start, props.end) - props.start) / (props.end - props.start);

    if (props.morphTo && measurements.value) {
        const { start, end } = measurements.value;
        const translateX = start.x * (1 - progress) + end.x * progress - end.x;
        const translateY = start.y * (1 - progress) + end.y * progress - end.y;

        styles['position'] = 'fixed';
        styles['left'] = `${end.x}px`;
        styles['top'] = `${end.y}px`;
        styles['width'] = `${start.width}px`;
        styles['height'] = `${start.height}px`;
        styles['transform-origin'] = 'top left';

        transforms.push(`translate(${translateX}px, ${translateY}px)`);
    }

    if (props.morphTo && measurements.value) {
        transforms.push(`scale(${(measurements.value.end.width / measurements.value.start.width - 1) * progress + 1})`);
    }

    if (props.appear) {
        styles['opacity'] = `${progress}`;
    } else if (props.disappear) {
        styles['opacity'] = `${1 - progress}`;
    }

    if (transforms.length > 0) {
        styles['transform'] = transforms.join(' ');
    }

    return [styles, props.style];
});
const placeholderStyles = computed(() => {
    if (!isActive.value || !measurements.value || !props.morphTo) {
        return;
    }

    return {
        width: `${measurements.value.start.width}px`,
        height: `${measurements.value.start.height}px`,
    };
});

watchEffect(() => {
    if (!isActive.value || !props.morphTo || !$root.value) {
        measurements.value = undefined;

        return;
    }

    const start = $root.value.getBoundingClientRect();
    const end = props.morphTo.getBoundingClientRect();

    measurements.value = {
        start: {
            x: start.x,
            y: window.scrollY + start.y,
            width: start.width,
            height: start.height,
        },
        end: {
            x: end.x,
            y: end.y,
            width: end.width,
            height: end.height,
        },
    };

    // Bust cached dimensions on window resize.
    windowDimensions.value;
});

defineExpose<ScrollTransitionExposed>({
    $el: $root,
});
</script>
