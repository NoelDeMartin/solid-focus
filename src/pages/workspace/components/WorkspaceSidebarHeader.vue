<template>
    <div class="group flex gap-2 px-4 pt-4">
        <!-- @vue-generic {Workspace | typeof ADD_WORKSPACE} -->
        <Select
            :model-value="$workspaces.current"
            :label="$t('workspaces.select')"
            label-class="sr-only"
            @update:model-value="changeWorkspace($event)"
        >
            <Button :as="HeadlessSelectTrigger" variant="ghost" class="-ml-1">
                <HeadlessSelectValue class="max-w-32 truncate text-left text-xl font-semibold">
                    {{ $workspaceName($workspace) }}
                </HeadlessSelectValue>
                <i-zondicons-cheveron-down class="ml-0.5 size-6" />
            </Button>
            <SelectOptions>
                <SelectOption
                    v-for="workspace in $workspaces.all"
                    :key="workspace.url"
                    :value="workspace"
                    :style="`${workspaceThemeVariables[workspace.url]} --highlighted-color: var(--color-primary-100)`"
                    inner-class="group-data-[highlighted]:bg-(--highlighted-color)"
                >
                    <div class="size-3 shrink-0 rounded-full" :style="{ background: `var(--color-primary-500)` }" />
                    <span :style="{ color: `var(--color-primary-900)` }">
                        {{ $workspaceName(workspace) }}
                    </span>
                </SelectOption>
                <SelectOption
                    :value="ADD_WORKSPACE"
                    class="rounded-none border-t border-gray-200 p-0"
                    inner-class="pl-2 pr-3 py-2 gap-1 group-data-[state=unchecked]:opacity-100"
                >
                    <i-material-symbols-add-circle class="size-5 shrink-0" />
                    <span>{{ $t('workspaces.add') }}</span>
                </SelectOption>
            </SelectOptions>
        </Select>
        <div class="flex-1" />
        <DropdownMenu
            v-if="$ui.mobile"
            :options="[
                {
                    label: $t('workspaces.edit'),
                    click: () => $workspace.edit(),
                },
                !$tasksList.is($workspace) && { label: $t('lists.edit'), click: () => $tasksList.edit() },
            ]"
        >
            <Button variant="ghost" class="-mr-2" :aria-label="$t('workspace.actions')">
                <i-zondicons-dots-horizontal-triple class="size-5" />
            </Button>
        </DropdownMenu>
        <div v-else class="-mr-4 overflow-hidden p-1 pr-2">
            <Button
                size="icon"
                variant="ghost"
                class="size-10 translate-x-full rounded-lg p-0 transition-transform group-hover:translate-x-0 focus:translate-x-0"
                :aria-label="$t('workspaces.edit')"
                :title="$t('workspaces.edit')"
                @click="$workspace.edit()"
            >
                <i-ic-baseline-edit class="size-5" />
            </Button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { HeadlessSelectTrigger, UI } from '@aerogel/core';

import Workspaces from '@/services/Workspaces';
import { DEFAULT_COLOR } from '@/utils/theme';
import type Workspace from '@/models/Workspace';

import WorkspaceSettingsModal from './modals/WorkspaceSettingsModal.vue';

const ADD_WORKSPACE = 'add-workspace' as const;
const workspaceThemeVariables = computed(() =>
    Workspaces.all.reduce(
        (variables, workspace) => {
            variables[workspace.url] = `
                --color-primary-50: color-mix(in oklab, var(--color-primary-600) 5%, transparent);
                --color-primary-100: color-mix(in oklab, var(--color-primary-600) 15%, transparent);
                --color-primary-200: color-mix(in oklab, var(--color-primary-600) 30%, transparent);
                --color-primary-300: color-mix(in oklab, var(--color-primary-600) 50%, transparent);
                --color-primary-400: color-mix(in oklab, var(--color-primary-600) 65%, transparent);
                --color-primary-500: color-mix(in oklab, var(--color-primary-600) 80%, transparent);
                --color-primary-600: ${workspace.color ?? DEFAULT_COLOR};
                --color-primary-700: color-mix(in oklab, var(--color-primary-600) 90%, black);
                --color-primary-800: color-mix(in oklab, var(--color-primary-600) 80%, black);
                --color-primary-900: color-mix(in oklab, var(--color-primary-600) 70%, black);
                --color-primary-950: color-mix(in oklab, var(--color-primary-600) 50%, black);
            `;

            return variables;
        },
        {} as Record<string, string>,
    ));

async function changeWorkspace(option: Workspace | typeof ADD_WORKSPACE) {
    if (option === ADD_WORKSPACE) {
        await UI.modal(WorkspaceSettingsModal);

        return;
    }

    if (UI.mobile) {
        Workspaces.toggleSidebar();
    }

    if (option && !Workspaces.current?.is(option)) {
        await option.open();
    }
}
</script>
