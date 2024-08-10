import { isInstanceOf } from '@noeldemartin/utils';

import animateStyles from '@/vivant/core/helpers/animate-styles';

export default async function slideUp(element: Element): Promise<void> {
    if (!isInstanceOf(element, HTMLElement)) {
        return;
    }

    await animateStyles(element, {
        initial: { willChange: 'transform' },
        onUpdate: (progress) => ({ transform: `translateY(${progress * -100}%)` }),
    });
}
