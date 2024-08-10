import { PromisedValue } from '@noeldemartin/utils';

import { Animation } from '@/vivant/core';
import type { AnimatedElement } from '@/vivant/core';

export type AnimationHook = (element: Element, done: Function) => void | Promise<void>;

export default class HookAnimation extends Animation {

    constructor(private implementation: AnimationHook) {
        super();
    }

    public run(element: AnimatedElement): Promise<void> {
        const finished = new PromisedValue<void>();
        const result = this.implementation(element.nativeElement, () => finished.resolve());

        return result instanceof Promise ? result : finished;
    }

}
