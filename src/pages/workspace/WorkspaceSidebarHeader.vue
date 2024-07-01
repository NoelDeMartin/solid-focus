<template>
    <div class="group flex gap-2 px-4 pt-4">
        <SelectInput
            :model-value="$workspaces.current"
            :label="$t('workspaces.select')"
            @update:model-value="changeWorkspace($event)"
        >
            <TextButton :as="SelectInputButton" color="clear" class="-ml-1">
                <span class="max-w-32 text-left text-xl font-semibold">{{ $workspace.name }}</span>
                <i-zondicons-cheveron-down class="ml-0.5 h-6 w-6" />
            </TextButton>
            <SelectInputOptions as="div" class="pb-10">
                <ul class="flex max-h-60 flex-col overflow-auto">
                    <SelectInputOption
                        v-for="workspace in $workspaces.all"
                        :key="workspace.url"
                        :value="workspace"
                        :active-style="{ background: THEME_COLORS[workspace.themeColor][100] }"
                    >
                        <div
                            class="mr-2 h-3 w-3 flex-shrink-0 rounded-full"
                            :style="{ background: THEME_COLORS[workspace.themeColor][500] }"
                        />
                        <span :style="{ color: THEME_COLORS[workspace.themeColor][900] }">
                            {{ workspace.name }}
                        </span>
                    </SelectInputOption>
                    <li
                        class="invisible flex h-0 max-w-[calc(100vw-2rem)] overflow-hidden pl-2 pr-3"
                        aria-hidden="true"
                    >
                        <i-material-symbols-add-circle class="h-5 w-5 flex-shrink-0" />
                        <span class="ml-1">{{ $t('workspaces.add') }}</span>
                    </li>
                    <SelectInputOption
                        :value="ADD_WORKSPACE"
                        class="absolute inset-x-0 bottom-0 bg-white p-0"
                        inner-class="opacity-1 rounded-none pl-2 pr-3 py-2 hover:bg-gray-100 border-t text-gray-700"
                    >
                        <i-material-symbols-add-circle class="h-5 w-5 flex-shrink-0" />
                        <span class="ml-1">{{ $t('workspaces.add') }}</span>
                    </SelectInputOption>
                </ul>
            </SelectInputOptions>
        </SelectInput>
        <div class="flex-1" />
        <OptionsMenu
            v-if="$ui.mobile"
            :options="[
                {
                    text: $t('workspaces.edit'),
                    click: () => $workspace.edit(),
                },
                !$tasksList.is($workspace) && { text: $t('lists.edit'), click: () => $tasksList.edit() },
            ]"
        >
            <IconButton :as="OptionsMenuButton" class="-mr-2">
                <i-zondicons-dots-horizontal-triple class="h-5 w-5" />
            </IconButton>
        </OptionsMenu>
        <div v-else class="-mr-4 overflow-hidden p-1 pr-2">
            <IconButton
                class="h-10 w-10 translate-x-full rounded-lg p-0 transition-transform focus:translate-x-0 group-hover:translate-x-0"
                :aria-label="$t('workspaces.edit')"
                :title="$t('workspaces.edit')"
                @click="$ui.openModal(WorkspaceSettingsModal, { workspace: $workspaces.current })"
            >
                <i-ic-baseline-edit class="h-6 w-6" />
            </IconButton>
        </div>
    </div>
</template>

<script setup lang="ts">
import { UI } from '@aerogel/core';

import OptionsMenuButton from '@/components/popups/OptionsMenuButton.vue';
import SelectInputButton from '@/components/forms/SelectInputButton.vue';
import Workspaces from '@/services/Workspaces';
import { THEME_COLORS } from '@/utils/colors';
import type Workspace from '@/models/Workspace';

import WorkspaceSettingsModal from './modals/WorkspaceSettingsModal.vue';

const ADD_WORKSPACE = 'add-workspace' as const;

async function changeWorkspace(option: Workspace | typeof ADD_WORKSPACE) {
    if (option === ADD_WORKSPACE) {
        await UI.openModal(WorkspaceSettingsModal);

        return;
    }

    if (UI.mobile) {
        Workspaces.toggleSidebar();
    }

    if (!Workspaces.current?.is(option)) {
        await option.open();
    }
}
</script>
