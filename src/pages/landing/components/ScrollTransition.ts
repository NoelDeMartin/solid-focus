import type { Ref, UnwrapNestedRefs } from 'vue';

export const Fills = {
    None: 'none',
    Forwards: 'forwards',
} as const;

export interface ScrollTransitionExposed {
    $el: Ref<HTMLElement | undefined>;
}

export type Fill = (typeof Fills)[keyof typeof Fills];
export type IScrollTransition = UnwrapNestedRefs<ScrollTransitionExposed>;
