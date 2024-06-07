<template>
    <nav>
        <ul>
            <WorkspaceSidebarNavItem :list="$workspace" />
            <WorkspaceSidebarNavItem
                v-for="list of lists"
                :key="list.url"
                :list="list"
                editable
            />
        </ul>
    </nav>
    <TextButton color="clear" class="group ml-2 mt-1.5 self-start text-gray-700" @click="createList()">
        <i-material-symbols-add-circle-rounded class="mr-1 h-6 w-6" />
        <div class="overflow-hidden">
            <span class="block -translate-x-full transition-all group-hover:translate-x-0 group-focus:translate-x-0">
                {{ $t('lists.add') }}
            </span>
        </div>
    </TextButton>
</template>

<script setup lang="ts">
import { Cloud } from '@aerogel/plugin-offline-first';
import { computedModels } from '@aerogel/plugin-soukai';
import { UI, translate } from '@aerogel/core';

import TasksList from '@/models/TasksList';
import Workspaces from '@/services/Workspaces';

const lists = computedModels(TasksList, () => Workspaces.current?.lists ?? []);

async function createList() {
    const name = await UI.prompt(translate('lists.createMessage'), {
        label: translate('lists.name'),
    });

    if (!name || !Workspaces.current) {
        return;
    }

    const list = await Workspaces.current.relatedLists.create({ name });

    await Workspaces.current.open(list);
    await Cloud.syncIfOnline(list);
}
</script>
