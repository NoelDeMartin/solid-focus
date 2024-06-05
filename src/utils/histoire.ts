import { computed, ref } from 'vue';
import { invert } from '@noeldemartin/utils';
import type { Ref } from 'vue';

import { bindWorkspaceColors } from '@/utils/composables';
import { WORKSPACE_COLOR_VALUES, WorkspaceColors } from '@/utils/colors';
import type { WorkspaceColor } from '@/utils/colors';

export function useWorkspaceColor(): [Ref<WorkspaceColor>, Record<string, string>] {
    const workspaceColor = ref<WorkspaceColor>(WorkspaceColors.Blue);
    const activeWorkspaceColors = computed(() => WORKSPACE_COLOR_VALUES[workspaceColor.value]);
    const workspaceColorOptions = invert(WorkspaceColors);

    bindWorkspaceColors(activeWorkspaceColors);

    return [workspaceColor, workspaceColorOptions];
}
