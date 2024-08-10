<template>
    <Transition
        v-if="enabled"
        v-bind="transitionProps"
        @enter="enter"
        @leave="leave"
    >
        <slot />
    </Transition>
    <slot v-else />
</template>

<script setup lang="ts">
import { AnimatedGroup, prefersReducedMotion, resolveAnimatedGroup } from '@/vivant/core';
import { computed, nextTick, ref, watch } from 'vue';
import { listenerProp, mixedProp } from '@aerogel/core';
import { objectOnly } from '@noeldemartin/utils';
import { onBeforeRouteUpdate, useRoute } from 'vue-router';

import { startGroupAnimation } from '@/vivant/vue/helpers/group-animations';
import type { AnimationHook } from '@/vivant/vue/animations/HookAnimation';

import { objectWithoutFalsish } from './utils';
import type { Falsish } from './utils';

const props = defineProps({
    enterActiveClass: mixedProp<string | Falsish>(),
    enterFromClass: mixedProp<string | Falsish>(),
    enterToClass: mixedProp<string | Falsish>(),
    leaveActiveClass: mixedProp<string | Falsish>(),
    leaveFromClass: mixedProp<string | Falsish>(),
    leaveToClass: mixedProp<string | Falsish>(),
    enterAnimation: mixedProp<string | Falsish>(),
    leaveAnimation: mixedProp<string | Falsish>(),
    onEnter: listenerProp<AnimationHook>(),
    onLeave: listenerProp<AnimationHook>(),
});
const enabled = ref(!prefersReducedMotion() && import.meta.env.MODE !== 'testing');
const route = useRoute();
const transitionProps = computed(() => {
    const classProps = objectOnly(props, ['enterActiveClass', 'enterFromClass', 'leaveActiveClass', 'leaveFromClass']);

    return objectWithoutFalsish(classProps);
});

async function enter(el: Element, done: Function): Promise<void> {
    await startGroupAnimation(
        el,
        objectWithoutFalsish({
            group: resolveAnimatedGroup(el) ?? new AnimatedGroup(),
            fromClass: props.enterFromClass,
            toClass: props.enterToClass,
            animate: props.onEnter,
            animation: props.enterAnimation,
        }),
    );

    done();
}

async function leave(el: Element, done: Function): Promise<void> {
    await startGroupAnimation(
        el,
        objectWithoutFalsish({
            group: resolveAnimatedGroup(el) ?? new AnimatedGroup(),
            fromClass: props.leaveFromClass,
            toClass: props.leaveToClass,
            animate: props.onLeave,
            animation: props.leaveAnimation,
        }),
    );

    done();
}

if (enabled.value) {
    onBeforeRouteUpdate(() => void (enabled.value = false));
    watch(route, () => nextTick(() => (enabled.value = true)));
}
</script>
