import { required } from '@noeldemartin/utils';
import { resolveAnimatedElement } from '@/vivant/core/registry';

export function getElementBounds(element: Element): [DOMRect?, DOMRect?] {
    const animatedElement = resolveAnimatedElement(element);

    return [animatedElement?.getPreviousBounds(), animatedElement?.getCurrentBounds()];
}

export function requireElementBounds(element: Element): [DOMRect, DOMRect] {
    const [first, last] = getElementBounds(element);

    return [required(first), required(last)];
}
