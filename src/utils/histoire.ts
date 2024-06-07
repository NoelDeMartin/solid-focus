import { computed, ref } from 'vue';
import { invert, stringToStudlyCase } from '@noeldemartin/utils';
import type { Ref } from 'vue';

import { THEME_COLORS, bindThemeColors } from '@/utils/colors';
import type { ThemeColor } from '@/utils/colors';

export function useThemeColor(): [Ref<ThemeColor>, Record<string, string>] {
    const themeColor = ref<ThemeColor>('sky');
    const activeThemeColors = computed(() => THEME_COLORS[themeColor.value]);
    const themeColorOptions = invert(
        Object.keys(THEME_COLORS).reduce((options, name) => {
            options[stringToStudlyCase(name)] = name;

            return options;
        }, {} as Record<string, string>),
    );

    bindThemeColors(activeThemeColors);

    return [themeColor, themeColorOptions];
}
