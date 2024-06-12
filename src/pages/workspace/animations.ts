import { element } from '@/utils/animations';
import type { ElementRef } from '@/utils/animations';

export async function showPanel($panel: ElementRef, $filler: ElementRef, direction: 'right' | 'left'): Promise<void> {
    const panel = element($panel);
    const filler = element($filler);

    if (!panel || !filler) {
        return;
    }

    panel.style.display = 'flex';

    await Promise.all([
        panel.animate(
            [
                { transform: direction === 'right' ? 'translateX(100%)' : 'translateX(-100%)' },
                { transform: 'translateX(0)' },
            ],
            {
                duration: 200,
                easing: 'ease-in',
                fill: 'forwards',
            },
        ).finished,
        filler.animate([{ width: '0px' }, { width: `${panel.clientWidth}px` }], {
            duration: 200,
            easing: 'ease-in',
            fill: 'forwards',
        }).finished,
    ]);
}

export async function hidePanel($panel: ElementRef, $filler: ElementRef, direction: 'right' | 'left'): Promise<void> {
    const panel = element($panel);
    const filler = element($filler);

    if (!panel || !filler) {
        return;
    }

    await Promise.all([
        panel.animate(
            [
                { transform: 'translateX(0%)' },
                { transform: direction === 'right' ? 'translateX(100%)' : 'translateX(-100%)' },
            ],
            {
                duration: 200,
                easing: 'ease-in',
                fill: 'forwards',
            },
        ).finished,
        filler.animate([{ width: `${panel.clientWidth}px` }, { width: '0px' }], {
            duration: 200,
            easing: 'ease-in',
            fill: 'forwards',
        }).finished,
    ]);

    panel.style.display = 'none';
}
