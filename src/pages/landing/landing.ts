import type { Ref } from 'vue';

// These are not exact image aspect ratios, but rather the ratios used for positioning and spacing.
export const SKY_HERO_HEIGHT = 160; // spacing.40
export const MOUNTAINS_HERO_ASPECT_RATIO = 900 / 4096;
export const MOUNTAINS_ASPECT_RATIO = 1114 / 4096;
export const MEADOW_ASPECT_RATIO = 231 / 4096;

export interface LandingContext {
    featuresScrollY: Ref<number | undefined>;
    showingForm: Ref<boolean>;
    showingCallout: Ref<boolean>;
}

declare module '@aerogel/core' {
    interface EventsPayload {
        'landing:get-started': void;
        'landing:log-in': void;
        'landing:ready': void;
        'landing:reset': void;
    }
}
