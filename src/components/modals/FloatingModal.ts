import type { IAGModal } from '@aerogel/core';
import type { Ref } from 'vue';

export interface IFloatingModal extends IAGModal {
    $panel: Ref<{ $el?: HTMLElement } | undefined>;
}
