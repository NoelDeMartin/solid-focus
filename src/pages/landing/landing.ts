import type { Ref } from 'vue';

export interface LandingContext {
    featuresScrollY: Ref<number | undefined>;
    showingForm: Ref<boolean>;
    showingCallout: Ref<boolean>;
}
