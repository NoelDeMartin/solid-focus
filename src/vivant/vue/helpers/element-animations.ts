import { AnimatedElement, registerGroupElement, resolveAnimation } from '@/vivant/core';
import type { AnimatedGroup } from '@/vivant/core';

import HookAnimation from '@/vivant/vue/animations/HookAnimation';
import type { AnimationHook } from '@/vivant/vue/animations/HookAnimation';

export interface AnimatedElementOptions {
    group: AnimatedGroup;
    animation?: string;
    animate?: AnimationHook;
}

export function setupAnimatedElement(element: Element, options: AnimatedElementOptions): Function {
    const animatedElement = new AnimatedElement(element);
    const groupCleanup = registerGroupElement(options.group, animatedElement);
    const Animation = options.animation && resolveAnimation(options.animation);

    options.animate && animatedElement.useAnimation(new HookAnimation(options.animate));
    Animation && animatedElement.useAnimation(new Animation());

    animatedElement.attach();

    return () => {
        animatedElement.detach();
        groupCleanup();
    };
}
