import { animateStyles, requireElementBounds } from '@/vivant/core';
import { isInstanceOf, required } from '@noeldemartin/utils';

function getFooterTopDelta(): number {
    const $footer = required(document.querySelector('footer'));
    const [first, last] = requireElementBounds(required($footer));

    return Math.min(first.height, Math.abs(first.top - last.top));
}

function footerMoved(): boolean {
    return getFooterTopDelta() !== 0;
}

export async function toggleFooter($footer: Element): Promise<void> {
    const [first, last] = requireElementBounds($footer);

    if (!footerMoved() || !isInstanceOf($footer, HTMLElement)) {
        return;
    }

    const isAppearing = last.top > first.top;
    const translateY = getFooterTopDelta();

    await animateStyles($footer, {
        initial: {
            position: 'fixed',
            bottom: `${-translateY}px`,
            background: 'white',
            willChange: 'transform',

            // Add 1px virtual padding to avoid appearing on top of side panels borders.
            left: `${last.left + 1}px`,
            width: `${last.width - 2}px`,
        },
        onUpdate: (progress) => ({
            transform: `translateY(${(isAppearing ? 1 - progress : progress) * -translateY}px)`,
        }),
    });
}

export async function toggleCompletedTasks($wrapper: Element): Promise<void> {
    const [first, last] = requireElementBounds($wrapper);

    if (!first || !last || !isInstanceOf($wrapper, HTMLElement)) {
        return;
    }

    const isGrowing = last.height > first.height;
    const bottomTranslateY = footerMoved() ? required(document.querySelector('footer')).clientHeight : 0;
    const $completedWrapper = required($wrapper.parentElement);
    const $list = required($wrapper.firstElementChild as HTMLElement);
    const listHeight = Math.abs(first.top - last.top) + bottomTranslateY - 1;
    const listMarginTop = parseInt(getComputedStyle($list).marginTop.slice(0, -2));
    const listTranslateYOffset = listMarginTop - 1;
    const wrapperScaleYOffset = 1 + bottomTranslateY;
    const wrapperScaleY = listHeight - 1 - bottomTranslateY;
    const listTranslateY = -(listHeight - bottomTranslateY - 1);

    await animateStyles(
        { $completedWrapper, $wrapper, $list },
        {
            initial: {
                $completedWrapper: { paddingBottom: `${bottomTranslateY}px` },
                $wrapper: {
                    position: 'absolute',
                    width: `${Math.max(first.width, last.width)}px`,
                    height: '1px',
                    bottom: '0',
                    transformOrigin: 'bottom',
                    willChange: 'transform',
                },
                $list: {
                    top: '0',
                    marginTop: '0',
                    transformOrigin: 'top',
                    willChange: 'transform',
                },
            },
            onUpdate(progress) {
                progress = isGrowing ? 1 - progress : progress;

                const wrapperScale = (1 - progress) * wrapperScaleY + wrapperScaleYOffset;
                const listScale = 1 / wrapperScale;
                const listTranslate = progress * listTranslateY + listTranslateYOffset;

                return {
                    $wrapper: { transform: `scaleY(${wrapperScale})` },
                    $list: { transform: `scaleY(${listScale}) translateY(${listTranslate}px)` },
                };
            },
        },
    );
}
