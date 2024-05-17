import { animate, easeInOut } from 'popmotion';
import type { Ref } from 'vue';

import Focus from '@/services/Focus';

type ElementRef = Ref<HTMLElement | { $el: HTMLElement | undefined } | undefined>;

async function fadeIn($element: ElementRef, options: Partial<KeyframeAnimationOptions> = {}): Promise<void> {
    const animation = element($element)?.animate([{ opacity: 0 }, { opacity: 1 }], {
        duration: 500,
        easing: 'ease-in',
        ...options,
    });

    await animation?.finished;
}

function element($element: ElementRef): HTMLElement | undefined {
    if (!$element.value) {
        return;
    }

    return '$el' in $element.value ? $element.value.$el : $element.value;
}

export type Styles = Partial<Record<keyof CSSStyleDeclaration, string>>;

export const FORM_ANIMATION_DURATION = 1200;

export async function scrollToHero(): Promise<void> {
    await new Promise<void>((resolve) => {
        animate({
            from: window.scrollY,
            to: 0,
            duration: Math.min(1000, window.scrollY / 2),
            ease: easeInOut,
            onUpdate: (value) => window.scrollTo({ top: value }),
            onComplete: () => resolve(),
        });
    });
}

export async function heroicEntrance($heroElements: ElementRef[], $arrow: ElementRef): Promise<void> {
    if (Focus.visits >= 3 || import.meta.env.MODE === 'testing') {
        return;
    }

    await Promise.all([
        ...$heroElements.map(($heroElement) =>
            fadeIn($heroElement, {
                duration: 1500,
                delay: 500,
                fill: 'backwards',
            })),
        fadeIn($arrow, {
            duration: 2000,
            delay: 3000,
            fill: 'backwards',
        }),
    ]);
}
