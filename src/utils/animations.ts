import type { Nullable } from '@noeldemartin/utils';
import type { Ref } from 'vue';

export type ElementRef = Ref<Nullable<HTMLElement> | { $el: Nullable<HTMLElement> }>;

export function element($element: ElementRef): Nullable<HTMLElement> {
    if (!$element.value) {
        return;
    }

    return '$el' in $element.value ? $element.value.$el : $element.value;
}
