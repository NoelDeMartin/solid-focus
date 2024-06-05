<template>
    <div class="group flex gap-2 px-4 pb-2 pt-4">
        <SelectInput
            :model-value="$workspaces.current"
            :label="$t('workspaces.select')"
            @update:model-value="changeWorkspace($event)"
        >
            <TextButton :as="SelectInputButton" color="clear" class="-ml-1">
                <span class="max-w-32 text-left text-xl font-semibold">{{ $workspace.name }}</span>
                <i-zondicons-cheveron-down class="ml-0.5 h-6 w-6" />
            </TextButton>
            <SelectInputOptions>
                <SelectInputOption
                    v-for="workspace in $workspaces.all"
                    :key="workspace.url"
                    :value="workspace"
                    :active-style="{ background: WORKSPACE_COLOR_VALUES[workspace.color][100] }"
                >
                    <div
                        class="mr-2 h-3 w-3 flex-shrink-0 rounded-full"
                        :style="{ background: WORKSPACE_COLOR_VALUES[workspace.color][500] }"
                    />
                    <span :style="{ color: WORKSPACE_COLOR_VALUES[workspace.color][900] }">{{ workspace.name }}</span>
                </SelectInputOption>
                <SelectInputOption :value="ADD_WORKSPACE" action>
                    <i-material-symbols-add class="-ml-1.5 h-6 w-6" />
                    <span class="ml-0.5">{{ $t('workspaces.add') }}</span>
                </SelectInputOption>
            </SelectInputOptions>
        </SelectInput>
        <div class="flex-1" />
        <div class="-mr-4 overflow-hidden p-1 pr-2">
            <IconButton
                class="h-10 w-10 translate-x-full rounded-lg p-0 transition-transform focus:translate-x-0 group-hover:translate-x-0"
                :aria-label="$t('workspaces.edit')"
                :title="$t('workspaces.edit')"
                @click="editWorkspace()"
            >
                <i-ic-baseline-edit class="h-6 w-6" />
            </IconButton>
        </div>
    </div>
</template>

<script setup lang="ts">
import { Cloud } from '@aerogel/plugin-offline-first';
import { UI, translate } from '@aerogel/core';

import SelectInputButton from '@/components/SelectInputButton.vue';
import Workspace from '@/models/Workspace';
import Workspaces from '@/services/Workspaces';
import { WORKSPACE_COLOR_VALUES } from '@/utils/colors';

const ADD_WORKSPACE = 'add-workspace' as const;

async function changeWorkspace(option: Workspace | typeof ADD_WORKSPACE) {
    if (option === ADD_WORKSPACE) {
        await createWorkspace();

        return;
    }

    await option.open();
}

async function editWorkspace(): Promise<void> {
    const name = await UI.prompt(translate('workspaces.updateMessage'), {
        label: translate('workspaces.name'),
        defaultValue: Workspaces.current?.name,
    });

    if (!name || !Workspaces.current) {
        return;
    }

    await Workspaces.current.update({ name });
    await Cloud.syncIfOnline(Workspaces.current);
}

async function createWorkspace(): Promise<void> {
    const name = await UI.prompt(translate('workspaces.createMessage'), {
        label: translate('workspaces.name'),
    });

    if (!name) {
        return;
    }

    const workspace = await Workspace.create({ name });

    await workspace.open();
    await Cloud.syncIfOnline(workspace);
}
</script>
