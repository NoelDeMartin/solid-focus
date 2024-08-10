<template>
    <component :is="as" ref="$root">
        <slot />
    </component>
</template>

<script setup lang="ts">
import { elementRef, listenerProp, mixedProp, objectProp, stringProp } from '@aerogel/core';
import { onUnmounted, watchEffect } from 'vue';
import type { AnimatedGroup } from '@/vivant/core';

import { setupAnimatedElement } from '@/vivant/vue/helpers/element-animations';
import type { AnimationHook } from '@/vivant/vue/animations/HookAnimation';

import { objectWithoutFalsish } from './utils';
import type { Falsish } from './utils';

const props = defineProps({
    as: stringProp('div'),
    group: objectProp<AnimatedGroup>(),
    animation: mixedProp<string | Falsish>(),
    onAnimate: listenerProp<AnimationHook>(),
});
const $root = elementRef();
let cleanup: Function;

watchEffect(() => {
    cleanup?.();

    if (!props.group || !$root.value) {
        return;
    }

    cleanup = setupAnimatedElement(
        $root.value,
        objectWithoutFalsish({
            group: props.group,
            animation: props.animation,
            animate: props.onAnimate,
        }),
    );
});

onUnmounted(() => cleanup?.());
</script>
