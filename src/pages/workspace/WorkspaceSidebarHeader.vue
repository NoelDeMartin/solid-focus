<template>
    <div class="flex gap-2 px-4 py-6">
        <AGSelect
            :model-value="selectedOption"
            :options="options"
            :aria-label="$t('workspaces.select')"
            options-text="name"
            @update:model-value="changeWorkspace($event)"
        />
    </div>
</template>

<script setup lang="ts">
import { Cloud } from '@aerogel/plugin-offline-first';
import { computed } from 'vue';
import { UI, translate } from '@aerogel/core';
import type { ArrayItem } from '@noeldemartin/utils';
import type { RefValue } from '@aerogel/plugin-soukai';

import Workspace from '@/models/Workspace';
import Workspaces from '@/services/Workspaces';

const ADD_WORKSPACE = Symbol('add-workspace');
const options = computed(() => [
    ...Workspaces.all,
    {
        id: ADD_WORKSPACE,
        name: translate('workspaces.add'),
    } as const,
]);
const selectedOption = computed(
    () => options.value.find((option) => option.id === Workspaces.current?.url) ?? options.value[0],
);

async function changeWorkspace(option: ArrayItem<RefValue<typeof options>>) {
    if (option.id === ADD_WORKSPACE) {
        await createWorkspace();

        return;
    }

    await option.open();
}

async function createWorkspace(): Promise<void> {
    const rawName = await UI.prompt(translate('workspaces.promptMessage'), {
        label: translate('workspaces.promptLabel'),
    });
    const name = rawName?.trim();

    if (!name) {
        return;
    }

    const workspace = await Workspace.create({ name });

    await workspace.open();
    await Cloud.syncIfOnline(workspace);
}
</script>
