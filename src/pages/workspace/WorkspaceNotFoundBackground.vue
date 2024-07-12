<template>
    <div class="bg-red-50 opacity-75" :style="style" />
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { animate, linear } from 'popmotion';

import { useDomEvent, useDoubleClick, useMouse } from '@/utils/composables';

const MASK_SIZE = Math.min(window.innerWidth, window.innerHeight);
const MASK_MAX_SCALE = 10;

let animation: { stop(): void } | null = null;
const mouse = useMouse();
const reveal = ref(false);
const scale = ref(1);
const style = computed(() => {
    if (mouse.x === null || mouse.y === null) {
        return 'mask-size: 0 0';
    }

    const position = {
        x: mouse.x - (MASK_SIZE * scale.value) / 2,
        y: mouse.y - (MASK_SIZE * scale.value) / 2,
    };

    return (
        `opacity:${scale.value === 1 ? 0.25 : 1};` +
        `mask-size:${MASK_SIZE * scale.value}px ${MASK_SIZE * scale.value}px;` +
        `mask-position:${position.x}px ${position.y}px;`
    );
});

function expand() {
    if (animation) {
        animation.stop();
    }

    animation = animate({
        from: scale.value,
        to: MASK_MAX_SCALE,
        ease: linear,
        duration: (5000 / (MASK_MAX_SCALE - 1)) * (MASK_MAX_SCALE - scale.value),
        onUpdate: (value) => (scale.value = value),
        onComplete: () => (animation = null),
    });
}

function contract() {
    if (animation) {
        animation.stop();
    }

    animation = animate({
        from: scale.value,
        to: 1,
        ease: linear,
        duration: (5000 / (MASK_MAX_SCALE - 1)) * (scale.value - 1),
        onUpdate: (value) => (scale.value = value),
        onComplete: () => (animation = null),
    });
}

useDomEvent('mousedown', () => reveal.value || expand());
useDomEvent('mouseup', () => reveal.value || contract());
useDoubleClick(() => ((reveal.value = !reveal.value), reveal.value && expand()));
</script>

<style scoped>
div {
    background-image: url('@/assets/img/workspaces/not-found.avif');
    background-size: cover;
    background-position: center;
    mask: url('@/assets/img/workspaces/not-found-mask.avif');
    mask-repeat: no-repeat;
    transition: opacity linear 1s;
    will-change: mask-position, mask-size, opacity;
}
</style>
