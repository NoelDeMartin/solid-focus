import { computed, customRef, onMounted, onUnmounted, reactive, readonly, watchEffect } from 'vue';
import { tap } from '@noeldemartin/utils';
import { UI } from '@aerogel/core';
import type { ComputedRef, Ref, WatchStopHandle } from 'vue';

function useDeferredRef<TValue>(value: TValue): Ref<TValue | undefined>;
function useDeferredRef<TValue, TInitial>(value: TValue, initial: TInitial): Ref<TValue | TInitial>;
function useDeferredRef<TValue, TInitial>(value: TValue, initial?: TInitial): Ref<TValue | TInitial | undefined> {
    return customRef((track, trigger) => {
        let deferred: TValue | TInitial | undefined = initial;
        const setValue = (newValue: TValue | TInitial | undefined) => {
            setTimeout(() => {
                deferred = newValue;

                trigger();
            }, 1000);
        };

        setValue(value);

        return {
            get: () => tap(deferred, () => track()),
            set: setValue,
        };
    });
}

function useLayoutReady(): Readonly<Ref<boolean>> {
    const documentReady = document.readyState === 'complete';
    const ready = useDeferredRef(documentReady, false);

    documentReady ||
        useDomEvent('readystatechange', (_, stop) => {
            if (document.readyState !== 'complete') {
                return;
            }

            ready.value = true;
            stop();
        });

    return ready;
}

export interface ElementScrollYOptions {
    scrollMarginTop?: number;
}

export function bindRefs<T>(source: Ref<T>, target: Ref<T>): WatchStopHandle {
    return watchEffect(() => (target.value = source.value));
}

export function useDomEvent<Event extends keyof DocumentEventMap>(
    type: Event,
    listener: (this: Document, event: DocumentEventMap[Event], stop: () => void) => unknown,
    options: AddEventListenerOptions = {},
): () => void {
    const nativeListener = (event: DocumentEventMap[Event]) => listener.call(document, event, stop);
    const stop = () => document.removeEventListener(type, nativeListener);

    onMounted(() => document.addEventListener(type, nativeListener, options));
    onUnmounted(() => stop());

    return stop;
}

export function useDoubleClick(listener: () => unknown): void {
    let lastClick = 0;

    useDomEvent('mousedown', () => {
        if (Date.now() - lastClick < 500) {
            listener();
        } else {
            lastClick = Date.now();
        }
    });
}

export function useElementScrollY(
    $element: Ref<HTMLElement | undefined>,
    options: ElementScrollYOptions = {},
): ComputedRef<number | undefined> {
    const ready = useLayoutReady();

    return computed(() => {
        if (!$element.value || !ready.value) {
            return;
        }

        return $element.value.getBoundingClientRect().y + window.scrollY - (options.scrollMarginTop ?? 0);
    });
}

export function useMouse(): Readonly<{ x: number | null; y: number | null }> {
    const mouse = reactive({
        x: null as number | null,
        y: null as number | null,
    });

    useDomEvent('mouseover', (e) => ((mouse.x = e.clientX), (mouse.y = e.clientY)), { once: true });
    useDomEvent('mousemove', (e) => ((mouse.x = e.clientX), (mouse.y = e.clientY)));
    useDomEvent(
        'touchmove',
        (e) => ((mouse.x = e.changedTouches[0]?.clientX ?? null), (mouse.y = e.changedTouches[0]?.clientY ?? null)),
    );

    return readonly(mouse);
}

export function useScrollY(): Readonly<Ref<number>> {
    return customRef((track, trigger) => {
        useDomEvent('scroll', () => trigger());

        return {
            get: () => tap(window.scrollY, () => track()),

            // eslint-disable-next-line no-console
            set: () => console.warn('scrollY ref was not set (it is immutable).'),
        };
    });
}

export function useWindowEvent<Event extends keyof WindowEventMap>(
    type: Event,
    listener: (event: WindowEventMap[Event], stop: () => void) => unknown,
): () => void {
    const nativeListener = (event: WindowEventMap[Event]) => listener.call(document, event, stop);
    const stop = () => window.removeEventListener(type, nativeListener);

    onMounted(() => window.addEventListener(type, nativeListener));
    onUnmounted(() => stop());

    return stop;
}

export function useWindowDimensions(): Readonly<Ref<{ width: number; height: number }>> {
    return customRef((track, trigger) => {
        useDomEvent('resize', () => trigger());

        return {
            get: () =>
                tap(
                    {
                        width: window.innerWidth,
                        height: window.innerHeight,
                    },
                    () => track(),
                ),

            // eslint-disable-next-line no-console
            set: () => console.warn('window dimensions ref was not set (it is immutable).'),
        };
    });
}

export function watchKeyboardShortcut(
    shortcut: string,
    listeners: Partial<{ start(): unknown; end(): unknown }> | (() => unknown),
): () => void {
    const shortcutListeners = typeof listeners === 'function' ? { start: listeners } : listeners;
    const consume = (event: KeyboardEvent) => {
        if (event.key !== shortcut) {
            return false;
        }

        const activeElementTagName = document.querySelector(':focus')?.tagName.toLowerCase();

        if (activeElementTagName === 'input' || activeElementTagName === 'textarea') {
            return false;
        }

        if (event.key === 'Escape' && UI.modals.length > 0) {
            return false;
        }

        event.preventDefault();

        return true;
    };

    const stops = [
        useWindowEvent('keydown', (event) => consume(event) && shortcutListeners.start?.()),
        useWindowEvent('keyup', (event) => consume(event) && shortcutListeners.end?.()),
    ];

    return () => stops.forEach((stop) => stop());
}
