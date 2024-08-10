import { defineServiceState } from '@aerogel/core';
import type { AnimatedGroup } from '@/vivant/core';
import type { AnimationHook } from '@/vivant/vue';

export interface FooterAnimation {
    group: AnimatedGroup;
    animation?: string;
    animate?: AnimationHook;
}

export default defineServiceState({
    name: 'focus',
    persist: ['visits', 'showCompleted'],
    initialState: {
        visits: 0,
        showCompleted: false,
        footerRightPadding: null as number | null,
        footerLeftPadding: null as number | null,
        footerAnimation: null as FooterAnimation | null,
    },
});
