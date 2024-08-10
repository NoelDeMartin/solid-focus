import { isInstanceOf } from '@noeldemartin/utils';

import animateMotion from '@/vivant/core/helpers/animate-motion';
import { resolveAnimatedGroup } from '@/vivant/core/registry';
import type { AnimationConfig } from '@/vivant/core/animations/config';

function resolveElementsConfig(elements: Record<string, HTMLElement>): AnimationConfig | null {
    for (const element of Object.values(elements)) {
        const group = resolveAnimatedGroup(element);

        if (!group) {
            continue;
        }

        return group.config();
    }

    return null;
}

function applyStyles<T extends Record<string, HTMLElement>>(
    elements: T,
    styles: Partial<Record<keyof T, Partial<CSSStyleDeclaration>>>,
): void {
    for (const [elementName, elementStyles] of Object.entries(styles)) {
        if (!elementStyles) {
            continue;
        }

        for (const [styleProperty, styleValue] of Object.entries(elementStyles)) {
            (elements[elementName] as unknown as { style: Record<string, unknown> }).style[styleProperty] = styleValue;
        }
    }
}

export interface ElementStylesAnimationOptions {
    config?: AnimationConfig;
    initial?: Partial<CSSStyleDeclaration>;
    onUpdate?(progress: number): Partial<CSSStyleDeclaration>;
}

export type ElementsStylesAnimationOptions<T extends Record<string, HTMLElement>> = {
    config?: AnimationConfig;
    initial?: Partial<Record<keyof T, Partial<CSSStyleDeclaration>>>;
    onUpdate?(progress: number): Partial<Record<keyof T, Partial<CSSStyleDeclaration>>>;
};

export default function animateStyles<T extends Record<string, HTMLElement>>(
    elements: T,
    options: ElementsStylesAnimationOptions<T>
): Promise<void>;
export default function animateStyles(element: HTMLElement, options: ElementStylesAnimationOptions): Promise<void>;
export default async function animateStyles<T extends Record<string, HTMLElement>>(
    elementOrElements: HTMLElement | T,
    defaultOptions: ElementStylesAnimationOptions | ElementsStylesAnimationOptions<T>,
): Promise<void> {
    const elements = isInstanceOf(elementOrElements, HTMLElement)
        ? ({ $el: elementOrElements } as Record<string, HTMLElement>)
        : elementOrElements;
    const options = (
        isInstanceOf(elementOrElements, HTMLElement)
            ? {
                config: defaultOptions.config,
                initial: defaultOptions.initial && { $el: defaultOptions.initial },
                onUpdate: defaultOptions.onUpdate && ((progress) => ({ $el: defaultOptions.onUpdate?.(progress) })),
            }
            : defaultOptions
    ) as ElementsStylesAnimationOptions<Record<string, HTMLElement>>;
    const config = options.config ?? resolveElementsConfig(elements);
    const initialStyles = Object.entries(elements).reduce((styles, [name, element]) => {
        styles[name] = element.getAttribute('style');

        return styles;
    }, {} as Record<string, string | null>);

    options.initial && applyStyles(elements, options.initial);

    await animateMotion({
        duration: config?.duration ?? 500,
        onUpdate: (progress) => {
            const styles = options.onUpdate?.(progress);

            styles && applyStyles(elements, styles);
        },
    });

    for (const [name, initial] of Object.entries(initialStyles)) {
        if (!initial) {
            elements[name]?.removeAttribute('style');

            continue;
        }

        elements[name]?.setAttribute('style', initial);
    }
}
