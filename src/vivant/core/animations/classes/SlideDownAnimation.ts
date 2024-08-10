import type AnimatedElement from '@/vivant/core/AnimatedElement';

import Animation from '@/vivant/core/animations/Animation';
import slideDown from '@/vivant/core/animations/helpers/slide-down';

export default class SlideDownAnimation extends Animation {

    public async run(element: AnimatedElement): Promise<void> {
        await slideDown(element.nativeElement);
    }

}
