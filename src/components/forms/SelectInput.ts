import type { Ref } from 'vue';

export interface __SetsSelectElements {
    __setButtonElement(element?: HTMLElement): void;
    __setMenuElement(element?: HTMLElement): void;
}

export interface ISelectInput {
    $button: Readonly<Ref<HTMLElement | undefined>>;
    $menu: Readonly<Ref<HTMLElement | undefined>>;
}
