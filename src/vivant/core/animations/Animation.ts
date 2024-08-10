import type AnimatedElement from '@/vivant/core/AnimatedElement';

export default abstract class Animation {

    public abstract run(element: AnimatedElement): Promise<void>;

}
