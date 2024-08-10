import { registerElement } from '@/vivant/core/registry';
import type Animation from '@/vivant/core/animations/Animation';

export default class AnimatedElement {

    public readonly nativeElement: Element;
    private animations: Animation[];
    private previousBounds?: DOMRect;
    private currentBounds?: DOMRect;
    private registryCleanup?: Function;

    constructor(nativeElement: Element) {
        this.nativeElement = nativeElement;
        this.animations = [];
    }

    public getPreviousBounds(): DOMRect | undefined {
        return this.previousBounds;
    }

    public getCurrentBounds(): DOMRect | undefined {
        return this.currentBounds;
    }

    public useAnimation(animation: Animation): void {
        this.animations.push(animation);
    }

    public attach(): void {
        this.registryCleanup = registerElement(this.nativeElement, this);
    }

    public detach(): void {
        this.registryCleanup?.();

        delete this.registryCleanup;
    }

    public measure(): void {
        this.previousBounds = this.currentBounds;
        this.currentBounds = this.nativeElement.getBoundingClientRect();
    }

    public async animate(): Promise<void> {
        await Promise.all(this.animations.map((animation) => animation.run(this)));
    }

}
