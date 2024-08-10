import { isInstanceOf } from '@noeldemartin/utils';

import animateStyles from '@/vivant/core/helpers/animate-styles';
import { requireElementBounds } from '@/vivant/core/helpers/bounds';

export default async function freeze(element: Element): Promise<void> {
    const [bounds] = requireElementBounds(element);

    if (!isInstanceOf(element, HTMLElement)) {
        return;
    }

    await animateStyles(element, {
        onUpdate: () => ({
            width: `${bounds.width}px`,
            height: `${bounds.height}px`,
        }),
    });
}
