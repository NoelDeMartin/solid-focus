import type { Ref } from 'vue';

export type ElementRef = Ref<HTMLElement | { $el: HTMLElement | undefined } | undefined>;

export function element($element: ElementRef): HTMLElement | undefined {
    if (!$element.value) {
        return;
    }

    return '$el' in $element.value ? $element.value.$el : $element.value;
}
