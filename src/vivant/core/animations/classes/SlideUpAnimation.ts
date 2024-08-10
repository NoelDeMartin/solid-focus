import type AnimatedElement from '@/vivant/core/AnimatedElement';

import Animation from '@/vivant/core/animations/Animation';
import slideUp from '@/vivant/core/animations/helpers/slide-up';

export default class SlideUpAnimation extends Animation {

    public async run(element: AnimatedElement): Promise<void> {
        await slideUp(element.nativeElement);
    }

}
