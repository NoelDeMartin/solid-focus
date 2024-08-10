import type { AnimationConfig } from '@/vivant/core/animations/config';

export default class AnimatedGroup {

    constructor(public duration: number = 500) {}

    public config(): AnimationConfig {
        return { duration: this.duration };
    }

}
