<template>
    <div :ref="forwardRef" v-bind="$attrs" :style="rootStyles">
        <slot />
    </div>

    <div v-if="placeholderStyles" :style="placeholderStyles" />
</template>

<script setup lang="ts">
import { clamp } from '@noeldemartin/utils';
import { computed, ref, watchEffect } from 'vue';
import { useForwardExpose } from 'reka-ui';
import type { Nullable } from '@noeldemartin/utils';
import type { StyleValue } from 'vue';

import { useScrollY, useWindowDimensions } from '@/utils/composables';

import { Fills } from './ScrollTransition';

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

const {
    appear,
    disabled,
    disappear,
    end = document.body.scrollHeight,
    fill = Fills.None,
    morphTo,
    start = 1,
    style,
} = defineProps<{
    appear?: boolean;
    disabled?: boolean;
    disappear?: boolean;
    end?: number;
    fill?: (typeof Fills)[keyof typeof Fills];
    morphTo?: Nullable<HTMLElement>;
    start?: number;
    style?: StyleValue;
}>();

const { forwardRef, currentRef } = useForwardExpose();
const measurements = ref<Measurements>();
const windowDimensions = useWindowDimensions();
const scrollY = useScrollY();
const isActive = computed(() => {
    if (disabled) {
        return false;
    }

    if (scrollY.value < start && (fill === Fills.None || fill === Fills.Forwards)) {
        return false;
    }

    if (scrollY.value > end && fill === Fills.None) {
        return false;
    }

    return true;
});
const rootStyles = computed(() => {
    if (!isActive.value) {
        return style;
    }

    const transforms: string[] = [];
    const styles: Record<string, string> = {};
    const progress = (clamp(scrollY.value, start, end) - start) / (end - start);

    if (morphTo && measurements.value) {
        const { start: measuredStart, end: measuredEnd } = measurements.value;
        const translateX = measuredStart.x * (1 - progress) + measuredEnd.x * progress - measuredEnd.x;
        const translateY = measuredStart.y * (1 - progress) + measuredEnd.y * progress - measuredEnd.y;

        styles['position'] = 'fixed';
        styles['left'] = `${measuredEnd.x}px`;
        styles['top'] = `${measuredEnd.y}px`;
        styles['width'] = `${measuredStart.width}px`;
        styles['height'] = `${measuredStart.height}px`;
        styles['transform-origin'] = 'top left';

        transforms.push(`translate(${translateX}px, ${translateY}px)`);
    }

    if (morphTo && measurements.value) {
        transforms.push(`scale(${(measurements.value.end.width / measurements.value.start.width - 1) * progress + 1})`);
    }

    if (appear) {
        styles['opacity'] = `${progress}`;
    } else if (disappear) {
        styles['opacity'] = `${1 - progress}`;
    }

    if (transforms.length > 0) {
        styles['transform'] = transforms.join(' ');
    }

    return [styles, style];
});
const placeholderStyles = computed(() => {
    if (!isActive.value || !measurements.value || !morphTo) {
        return;
    }

    return {
        width: `${measurements.value.start.width}px`,
        height: `${measurements.value.start.height}px`,
    };
});

watchEffect(() => {
    if (!isActive.value || !morphTo || !currentRef.value) {
        measurements.value = undefined;

        return;
    }

    const clientStart = (currentRef.value as Element).getBoundingClientRect();
    const clientEnd = morphTo.getBoundingClientRect();

    measurements.value = {
        start: {
            x: clientStart.x,
            y: window.scrollY + clientStart.y,
            width: clientStart.width,
            height: clientStart.height,
        },
        end: {
            x: clientEnd.x,
            y: clientEnd.y,
            width: clientEnd.width,
            height: clientEnd.height,
        },
    };

    // Bust cached dimensions on window resize.
    windowDimensions.value;
});
</script>
