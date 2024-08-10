import Animation from '@/vivant/core/animations/Animation';
import freeze from '@/vivant/core/animations/helpers/freeze';
import type AnimatedElement from '@/vivant/core/AnimatedElement';

export default class FreezeAnimation extends Animation {

    public async run(element: AnimatedElement): Promise<void> {
        await freeze(element.nativeElement);
    }

}
