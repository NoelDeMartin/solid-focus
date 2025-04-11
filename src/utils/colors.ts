import tailwindColors from 'tailwindcss/colors';
import { objectOnly } from '@noeldemartin/utils';
import { watchEffect } from 'vue';
import type { Ref, WatchStopHandle } from 'vue';

export const THEME_COLORS = objectOnly(tailwindColors, ['amber', 'red', 'sky', 'emerald', 'purple', 'pink']);
export type ThemeColor = keyof typeof THEME_COLORS;

export function bindThemeColors(colors: Ref<Record<string, string>>): WatchStopHandle {
    return watchEffect((onCleanup) => {
        Object.entries(colors.value).forEach(([name, value]) => {
            document.body.style.setProperty(`--color-primary-${name}`, value);
        });

        onCleanup(() => {
            Object.keys(colors.value).forEach((name) => {
                document.body.style.removeProperty(`--color-primary-${name}`);
            });
        });
    });
}
