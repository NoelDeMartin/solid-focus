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
            <SelectInputOptions class="flex flex-col">
                <div class="max-h-60 overflow-auto">
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
                </div>

                <SelectInputOption
                    :value="ADD_WORKSPACE"
                    class="p-0"
                    inner-class="opacity-1 rounded-none pl-2 pr-3 py-2 hover:bg-gray-100 border-t text-gray-700"
                >
                    <i-material-symbols-add-circle class="h-5 w-5" />
                    <span class="ml-1">{{ $t('workspaces.add') }}</span>
                </SelectInputOption>
            </SelectInputOptions>
        </SelectInput>
        <div class="flex-1" />
        <div class="-mr-4 overflow-hidden p-1 pr-2">
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

import SelectInputButton from '@/components/forms/SelectInputButton.vue';
import { THEME_COLORS } from '@/utils/colors';
import type Workspace from '@/models/Workspace';

import WorkspaceSettingsModal from './modals/WorkspaceSettingsModal.vue';

const ADD_WORKSPACE = 'add-workspace' as const;

async function changeWorkspace(option: Workspace | typeof ADD_WORKSPACE) {
    if (option === ADD_WORKSPACE) {
        await UI.openModal(WorkspaceSettingsModal);

        return;
    }

    await option.open();
}
</script>
