<template>
    <div class="min-w-56 px-4">
        <nav class="py-6">
            <ul class="list-disc pl-8">
                <li v-for="list of $workspace.lists" :key="list.id">
                    <AGLink route="workspace" :route-params="{ workspace: $workspace.slug, list: list.slug }">
                        {{ list.name }}
                    </AGLink>
                    <span v-if="$tasksLists.current?.id === list.id" class="ml-1">(active)</span>
                </li>
            </ul>
        </nav>
        <AGButton class="w-full" @click="createList()">
            {{ $t('lists.add') }}
        </AGButton>
    </div>
</template>

<script setup lang="ts">
import { UI, translate } from '@aerogel/core';

import TasksList from '@/models/TasksList';
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

    const list = await TasksList.create({ name });

    workspace.relatedLists.attach(list);

    await workspace.save();
    await workspace.open(list);
}
</script>
