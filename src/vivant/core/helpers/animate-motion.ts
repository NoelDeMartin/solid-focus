import { animate } from 'popmotion';
import type { AnimationOptions } from 'popmotion';

export default function animateMotion(options: AnimationOptions<number>): Promise<void> {
    return new Promise((resolve) =>
        animate({
            ...options,
            onComplete: () => (options.onComplete?.(), resolve()),
        }));
}
