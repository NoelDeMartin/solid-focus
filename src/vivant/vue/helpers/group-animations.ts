import { AnimatedElement, resolveAnimation, resolveGroupElements } from '@/vivant/core';
import { nextTick } from 'vue';
import { PromisedValue } from '@noeldemartin/utils';
import type { AnimatedGroup } from '@/vivant/core';

import HookAnimation from '@/vivant/vue/animations/HookAnimation';
import type { AnimatedElementOptions } from '@/vivant/vue/helpers/element-animations';

interface ActiveGroupAnimation {
    done: PromisedValue<void>;
    classes: WeakMap<AnimatedElement, { from?: string; to?: string }>;
    elements: AnimatedElement[];
}

const activeGroupAnimations = new WeakMap<AnimatedGroup, ActiveGroupAnimation>();

async function runGroupAnimation(group: AnimatedGroup, animation: ActiveGroupAnimation): Promise<void> {
    // Measure group elements.
    const groupElements = resolveGroupElements(group);

    for (const element of groupElements) {
        element.measure();
    }

    // Update from and to classes.
    // We need to do this manually because Vue's implementation takes two frames to update, and this causes
    // a flicker in the UI when the implementation relies on JavaScript updates rather than CSS transitions.
    // See https://github.com/vuejs/core/blob/v3.4.0/packages/runtime-dom/src/components/Transition.ts#L316..L320
    for (const element of animation.elements) {
        const elementClasses = animation.classes.get(element);
        elementClasses?.from?.split(' ').forEach((className) => element.nativeElement.classList.remove(className));
        elementClasses?.to?.split(' ').forEach((className) => element.nativeElement.classList.add(className));
    }

    // Measure again and run animations.
    const elements = [...animation.elements, ...groupElements];

    elements.map((element) => element.measure());

    await Promise.all(elements.map((element) => element.animate()));

    // Remove classes.
    for (const element of animation.elements) {
        const elementClasses = animation.classes.get(element);
        elementClasses?.to?.split(' ').forEach((className) => element.nativeElement.classList.remove(className));
    }

    // Complete group animation.
    animation.done.resolve();
    animation.elements.forEach((element) => element.detach());
    activeGroupAnimations.delete(group);
}

function initializeGroupAnimation(group: AnimatedGroup): ActiveGroupAnimation {
    const animation: ActiveGroupAnimation = {
        done: new PromisedValue(),
        classes: new WeakMap(),
        elements: [],
    };

    nextTick(() => runGroupAnimation(group, animation));

    activeGroupAnimations.set(group, animation);

    return animation;
}

export interface GroupAnimationOptions extends AnimatedElementOptions {
    fromClass?: string;
    toClass?: string;
}

export async function startGroupAnimation(element: Element, options: GroupAnimationOptions): Promise<void> {
    const activeAnimation = activeGroupAnimations.get(options.group) ?? initializeGroupAnimation(options.group);
    const animatedElement = new AnimatedElement(element);
    const Animation = options.animation && resolveAnimation(options.animation);

    options.animate && animatedElement.useAnimation(new HookAnimation(options.animate));
    Animation && animatedElement.useAnimation(new Animation());
    animatedElement.measure();
    animatedElement.attach();

    activeAnimation.elements.push(animatedElement);
    activeAnimation.classes.set(animatedElement, { from: options.fromClass, to: options.toClass });

    await activeAnimation.done;
}
