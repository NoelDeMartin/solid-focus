import { animateStyles, getPreviousSnapshot, getSnapshot, resetElementStyles } from 'vivant';
import { clamp, required, toString } from '@noeldemartin/utils';
import type { AnimatableElement } from 'vivant';

function getComputedSize(element: HTMLElement, property: keyof CSSStyleDeclaration): number {
    return parseInt(toString(getComputedStyle(element)[property]));
}

export async function slideUp(element: AnimatableElement): Promise<void> {
    await animateStyles(
        element,
        { transform: 'translateY(-100%)' },
        {
            initial: { transform: 'translateY(0%)' },
        },
    );
}

export async function slideDown(element: AnimatableElement): Promise<void> {
    await animateStyles(
        element,
        { transform: 'translateY(0%)' },
        {
            initial: { transform: 'translateY(-100%)' },
        },
    );
}

export async function toggleCompletedTasks($wrapper: AnimatableElement): Promise<void> {
    const $parent = required($wrapper.parentElement as HTMLElement);
    const $list = required($wrapper.firstElementChild as HTMLElement);
    const $footer = required(document.querySelector('footer')?.parentElement as HTMLElement);
    const first = required(getPreviousSnapshot($wrapper)).bounds;
    const last = required(getSnapshot($wrapper)).bounds;
    const isGrowing = last.height > first.height;
    const footerHeight = $footer.clientHeight;
    const footerOffset =
        footerHeight - clamp(window.innerHeight - Math.max(first.bottom, last.bottom), 0, footerHeight);
    const footerOffsetCorrection = footerOffset > 0 ? -(footerHeight - footerOffset) : 0;
    const visibleListHeight = Math.abs(first.top - last.top) + footerOffset;
    const listMarginTop = getComputedSize($list, 'marginTop');

    $wrapper.style.position = 'absolute';
    $wrapper.style.width = `${Math.max(first.width, last.width)}px`;
    $wrapper.style.height = '1px';
    $wrapper.style.bottom = '0';
    $wrapper.style.transformOrigin = 'bottom';
    $wrapper.style.willChange = 'transform';

    $list.style.marginTop = '0';
    $list.style.transformOrigin = 'top';
    $list.style.willChange = 'transform';

    if (footerOffset > 0) {
        $parent.style.paddingBottom = `${footerHeight}px`;

        $footer.style.willChange = 'transform';
        $footer.style.position = 'absolute';
        $footer.style.bottom = '0px';
        $footer.style.left = '0px';
        $footer.style.right = '0px';
    }

    // For some reason, the animation flickers in Firefox without this :/.
    if (isGrowing && navigator.userAgent.includes('Firefox')) {
        $list.classList.add('[&_li]:opacity-[0.98]');
    }

    await animateStyles($wrapper, (progress) => {
        progress = isGrowing ? progress : 1 - progress;

        const progressInverse = 1 - progress;
        const wrapperScale = progress * visibleListHeight;
        const wrapperTranslate = progressInverse * -footerOffset + footerOffsetCorrection;
        const listScale = 1 / wrapperScale;
        const listTranslate =
            progressInverse * -visibleListHeight - wrapperTranslate + listMarginTop + footerOffsetCorrection;
        const footerTranslate = progress * footerOffset;

        $wrapper.style.transform = `translateY(${wrapperTranslate}px) scaleY(${wrapperScale})`;
        $list.style.transform = `scaleY(${listScale}) translateY(${listTranslate}px)`;
        $footer.style.transform = `translateY(${footerTranslate}px)`;
    });

    resetElementStyles($parent);
    resetElementStyles($wrapper);
    resetElementStyles($list);
    resetElementStyles($footer);
}
