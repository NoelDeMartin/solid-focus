import { isInstanceOf } from '@noeldemartin/utils';

import animateStyles from '@/vivant/core/helpers/animate-styles';
import Animation from '@/vivant/core/animations/Animation';
import type AnimatedElement from '@/vivant/core/AnimatedElement';

export default class LayoutAnimation extends Animation {

    public async run(element: AnimatedElement): Promise<void> {
        const first = element.getPreviousBounds();
        const last = element.getCurrentBounds();

        if (!isInstanceOf(element.nativeElement, HTMLElement) || !first || !last || first.y === last.y) {
            return;
        }

        await animateStyles(element.nativeElement, {
            initial: { willChange: 'transform' },
            onUpdate: (progress) => ({ transform: `translateY(${(1 - progress) * (first.y - last.y)}px)` }),
        });
    }

}
