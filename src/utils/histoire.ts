import { bindWorkspaceColors } from '@/utils/composables';
import { computed, ref } from 'vue';
import { invert } from '@noeldemartin/utils';
import type { Ref } from 'vue';

const WorkspaceColors = {
    Red: 'red',
    Green: 'green',
    Blue: 'blue',
} as const;

type WorkspaceColor = (typeof WorkspaceColors)[keyof typeof WorkspaceColors];

const WORKSPACE_COLOR_VALUES: Record<WorkspaceColor, Record<string, string>> = {
    [WorkspaceColors.Red]: {
        50: '#fef2f2',
        100: '#fee2e2',
        200: '#fecaca',
        300: '#fca5a5',
        400: '#f87171',
        500: '#ef4444',
        600: '#dc2626',
        700: '#b91c1c',
        800: '#991b1b',
        900: '#7f1d1d',
        950: '#450a0a',
    },
    [WorkspaceColors.Green]: {
        50: '#f0fdf4',
        100: '#dcfce7',
        200: '#bbf7d0',
        300: '#86efac',
        400: '#4ade80',
        500: '#22c55e',
        600: '#16a34a',
        700: '#15803d',
        800: '#166534',
        900: '#14532d',
        950: '#052e16',
    },
    [WorkspaceColors.Blue]: {
        50: '#eff6ff',
        100: '#dbeafe',
        200: '#bfdbfe',
        300: '#93c5fd',
        400: '#60a5fa',
        500: '#3b82f6',
        600: '#2563eb',
        700: '#1d4ed8',
        800: '#1e40af',
        900: '#1e3a8a',
        950: '#172554',
    },
};

export function useWorkspaceColor(): [Ref<WorkspaceColor>, Record<string, string>] {
    const workspaceColor = ref<WorkspaceColor>(WorkspaceColors.Blue);
    const activeWorkspaceColors = computed(() => WORKSPACE_COLOR_VALUES[workspaceColor.value]);
    const workspaceColorOptions = invert(WorkspaceColors);

    bindWorkspaceColors(activeWorkspaceColors);

    return [workspaceColor, workspaceColorOptions];
}
