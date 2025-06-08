import { defineDirective } from '@aerogel/core';

const intersectionObservers: WeakMap<HTMLElement, IntersectionObserver> = new WeakMap();

export type IntersectDirectiveListener = (visible: boolean) => unknown;

export default defineDirective({
    mounted(element: HTMLElement, { value }) {
        const listener = value as IntersectDirectiveListener;
        const observer = new IntersectionObserver(([entry]) => listener(entry.isIntersecting));

        observer.observe(element);
        intersectionObservers.set(element, observer);
    },
    unmounted(element) {
        intersectionObservers.get(element)?.unobserve(element);
        intersectionObservers.delete(element);
    },
});
