import type { Ref } from 'vue';

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
