import { defineDirective } from '@aerogel/core';
import { nextTick } from 'vue';
import { resolveAnimatedGroup } from '@/vivant/core';

import { setupAnimatedElement } from '@/vivant/vue/helpers/element-animations';

const cleanup = new WeakMap<Element, Function>();

export default defineDirective({
    mounted(element) {
        nextTick(() => {
            const group = resolveAnimatedGroup(element);

            if (!group) {
                // eslint-disable-next-line no-console
                console.warn('v-animate-layout only works inside <AnimatedGroup> components');

                return;
            }

            cleanup.set(
                element,
                setupAnimatedElement(element, {
                    group,
                    animation: 'layout',
                }),
            );
        });
    },
    unmounted(element) {
        cleanup.get(element)?.();
        cleanup.delete(element);
    },
});
