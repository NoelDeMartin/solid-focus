import { computed, customRef, onMounted, onUnmounted, watchEffect } from 'vue';
import { tap } from '@noeldemartin/utils';
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

export function bindWorkspaceColors(colors: Ref<Record<string, string>>): WatchStopHandle {
    return watchEffect((onCleanup) => {
        Object.entries(colors.value).forEach(([name, value]) => {
            document.body.style.setProperty(`--primary-${name}`, value);
        });

        onCleanup(() => {
            Object.keys(colors.value).forEach((name) => {
                document.body.style.removeProperty(`--primary-${name}`);
            });
        });
    });
}

export function useDomEvent<Event extends keyof DocumentEventMap>(
    type: Event,
    listener: (this: Document, event: DocumentEventMap[Event], stop: () => void) => unknown,
): () => void {
    const nativeListener = (event: DocumentEventMap[Event]) => listener.call(document, event, stop);
    const stop = () => document.removeEventListener(type, nativeListener);

    onMounted(() => document.addEventListener(type, nativeListener));
    onUnmounted(() => stop());

    return stop;
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
    listeners: Partial<{ start(): unknown; end(): unknown }>,
): () => void {
    const stops = [
        useWindowEvent('keydown', (e) => e.key === shortcut && listeners.start?.()),
        useWindowEvent('keyup', (e) => e.key === shortcut && listeners.end?.()),
    ];

    return () => stops.forEach((stop) => stop());
}
