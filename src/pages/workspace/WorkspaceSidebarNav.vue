<template>
    <nav>
        <ul>
            <WorkspaceSidebarNavItem :list="$workspace" />
            <WorkspaceSidebarNavItem v-for="list of $workspace.lists" :key="list.url" :list="list" />
        </ul>
    </nav>
    <button type="button" class="mx-auto mt-6 flex w-fit space-x-1 self-center" @click="createList()">
        <i-material-symbols-add-circle-rounded class="h-4 w-4" />
        <span>{{ $t('lists.add') }}</span>
    </button>
</template>

<script setup lang="ts">
import { Cloud } from '@aerogel/plugin-offline-first';
import { UI, translate } from '@aerogel/core';

import Workspaces from '@/services/Workspaces';

async function createList() {
    const rawName = await UI.prompt(translate('lists.promptMessage'), {
        label: translate('lists.promptLabel'),
    });
    const name = rawName?.trim();
    const workspace = Workspaces.current;

    if (!name || !workspace) {
        return;
    }

    const list = await workspace.relatedLists.create({ name });

    await workspace.open(list);
    await Cloud.syncIfOnline(list);
}
</script>
