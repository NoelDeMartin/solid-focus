<template>
    <div ref="$root">
        <slot />
    </div>
</template>

<script setup lang="ts">
import { AnimatedGroup, registerGroup } from '@/vivant/core';
import { elementRef, numberProp } from '@aerogel/core';
import { onMounted, onUnmounted, watchEffect } from 'vue';

import type { IAnimatedGroup } from './AnimatedGroup';

const props = defineProps({ duration: numberProp(500) });
const $root = elementRef();
const group = new AnimatedGroup(props.duration);
let cleanup: Function;

watchEffect(() => (group.duration = props.duration));

onMounted(() => {
    cleanup?.();

    if (!$root.value) {
        return;
    }

    cleanup = registerGroup($root.value, group);
});

onUnmounted(() => cleanup?.());

defineExpose<IAnimatedGroup>({ group });
</script>
