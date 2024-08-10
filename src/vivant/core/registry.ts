import type { Constructor } from '@noeldemartin/utils';

import FreezeAnimation from '@/vivant/core/animations/classes/FreezeAnimation';
import LayoutAnimation from '@/vivant/core/animations/classes/LayoutAnimation';
import SlideDownAnimation from '@/vivant/core/animations/classes/SlideDownAnimation';
import SlideUpAnimation from '@/vivant/core/animations/classes/SlideUpAnimation';
import type AnimatedElement from '@/vivant/core/AnimatedElement';
import type AnimatedGroup from '@/vivant/core/AnimatedGroup';
import type Animation from '@/vivant/core/animations/Animation';

const animations: Record<string, Constructor<Animation>> = {
    'freeze': FreezeAnimation,
    'layout': LayoutAnimation,
    'slide-down': SlideDownAnimation,
    'slide-up': SlideUpAnimation,
};
const elements = new WeakMap<Element, AnimatedElement>();
const groups = new Map<Element, AnimatedGroup>();
const groupElements = new WeakMap<AnimatedGroup, Set<AnimatedElement>>();
const elementsGroup = new WeakMap<AnimatedElement, AnimatedGroup>();

export function registerElement(element: Element, animatedElement: AnimatedElement): Function {
    elements.set(element, animatedElement);

    return () => elements.delete(element);
}

export function registerGroup(element: Element, group: AnimatedGroup): Function {
    groups.set(element, group);

    return () => groups.delete(element);
}

export function registerGroupElement(group: AnimatedGroup, element: AnimatedElement): Function {
    const registerElements = groupElements.get(group) ?? new Set();

    registerElements.add(element);
    groupElements.set(group, registerElements);
    elementsGroup.set(element, group);

    return () => {
        const cleanUpElements = groupElements.get(group) ?? new Set();

        cleanUpElements.delete(element);
        elementsGroup.delete(element);

        if (cleanUpElements.size === 0) {
            groupElements.delete(group);
        }
    };
}

export function resolveAnimation(name: string): Constructor<Animation> | undefined {
    return animations[name];
}

export function resolveAnimatedElement(element: Element): AnimatedElement | undefined {
    return elements.get(element);
}

export function resolveAnimatedGroup(element: Element): AnimatedGroup | undefined {
    const animatedElement = elements.get(element);

    if (animatedElement && elementsGroup.has(animatedElement)) {
        return elementsGroup.get(animatedElement);
    }

    for (const groupElement of groups.keys()) {
        if (!groupElement.contains(element)) {
            continue;
        }

        return groups.get(groupElement);
    }
}

export function resolveGroupElements(group: AnimatedGroup): Set<AnimatedElement> {
    return groupElements.get(group) ?? new Set();
}
