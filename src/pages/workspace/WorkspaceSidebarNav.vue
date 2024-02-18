<template>
    <div class="min-w-56 px-4">
        <nav class="py-6">
            <ul class="list-disc pl-8">
                <li>
                    <AGLink route="workspace" :route-params="{ workspace: $workspace.slug }">
                        {{ $t('lists.inbox') }}
                    </AGLink>
                    <span v-if="$tasksLists.current?.url === $workspace.url" class="ml-1">(active)</span>
                </li>
                <li v-for="list of $workspace.lists" :key="list.url">
                    <AGLink route="workspace" :route-params="{ workspace: $workspace.slug, list: list.slug }">
                        {{ list.name }}
                    </AGLink>
                    <span v-if="$tasksLists.current?.url === list.url" class="ml-1">(active)</span>
                </li>
            </ul>
        </nav>
        <AGButton class="w-full" @click="createList()">
            {{ $t('lists.add') }}
        </AGButton>
    </div>
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
