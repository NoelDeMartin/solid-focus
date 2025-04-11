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
    <Button variant="ghost" class="group mt-1.5 ml-2 self-start text-gray-700" @click="createList()">
        <i-material-symbols-add-circle-rounded class="mr-1 size-6" />
        <div class="overflow-hidden">
            <span class="block -translate-x-full transition-all group-hover:translate-x-0 group-focus:translate-x-0">
                {{ $t('lists.add') }}
            </span>
        </div>
    </Button>
</template>

<script setup lang="ts">
import { arraySorted } from '@noeldemartin/utils';
import { computedModels } from '@aerogel/plugin-soukai';
import { UI, translate } from '@aerogel/core';

import TasksList from '@/models/TasksList';
import Workspaces from '@/services/Workspaces';

const lists = computedModels(TasksList, () => arraySorted(Workspaces.current?.lists ?? [], 'name'));

async function createList() {
    const name = await UI.prompt(translate('lists.add'), {
        label: translate('lists.name'),
        acceptText: translate('ui.create'),
        cancelVariant: 'secondary',
    });

    if (!name || !Workspaces.current) {
        return;
    }

    const list = await Workspaces.current.relatedLists.create({ name });

    if (UI.mobile) {
        Workspaces.toggleSidebar();
    }

    await Workspaces.current.open(list);
}
</script>
