import { element } from '@/utils/animations';
import type { ElementRef } from '@/utils/animations';

export default class PanelAnimator {

    private showing: boolean = false;
    private hiddenTranslate: string;

    constructor(
        private $panel: ElementRef,
        private $filler: ElementRef,
        direction: 'right' | 'left',
    ) {
        this.hiddenTranslate = direction === 'right' ? '100%' : '-100%';
    }

    public async show(): Promise<void> {
        if (this.showing) {
            return;
        }

        const panel = element(this.$panel);
        const filler = element(this.$filler);

        if (!panel || !filler) {
            return;
        }

        this.showing = true;
        panel.style.display = 'flex';

        await Promise.all([
            panel.animate([{ translate: this.hiddenTranslate }, { translate: '0%' }], {
                duration: 200,
                easing: 'ease-in',
                fill: 'forwards',
            }).finished,
            filler.animate([{ width: '0px' }, { width: `${panel.clientWidth}px` }], {
                duration: 200,
                easing: 'ease-in',
                fill: 'forwards',
            }).finished,
        ]);
    }

    public async hide(): Promise<void> {
        if (!this.showing) {
            return;
        }

        const panel = element(this.$panel);
        const filler = element(this.$filler);

        if (!panel || !filler) {
            return;
        }

        await Promise.all([
            panel.animate([{ translate: '0%' }, { translate: this.hiddenTranslate }], {
                duration: 200,
                easing: 'ease-in',
                fill: 'forwards',
            }).finished,
            filler.animate([{ width: `${panel.clientWidth}px` }, { width: '0px' }], {
                duration: 200,
                easing: 'ease-in',
                fill: 'forwards',
            }).finished,
        ]);

        this.showing = false;
        panel.style.display = 'none';
    }

}
