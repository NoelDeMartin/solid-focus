<template>
    <li class="group relative" :aria-current="isActive && 'page'">
        <div class="px-2 py-0.5">
            <AGHeadlessButton
                class="block rounded-lg px-4 py-3 hover:no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[--primary-700]"
                :class="{
                    'bg-[var(--primary-100)] font-semibold text-[--primary-900] hover:bg-[--primary-200]': isActive,
                    'hover:bg-gray-100': !isActive,
                }"
                v-bind="list.routeAttributes"
                @click="$ui.mobile && $workspaces.toggleSidebar()"
            >
                {{ $listName(list) }}
            </AGHeadlessButton>
        </div>
        <div
            v-if="editable"
            class="pointer-events-none absolute right-0 top-1/2 mr-2 -translate-y-1/2 overflow-hidden p-1"
        >
            <IconButton
                class="clickable-target pointer-events-auto h-9 w-9 translate-x-full rounded-md p-0 transition-transform focus:translate-x-0 group-hover:translate-x-0"
                :class="isActive && 'hover:bg-[--primary-200]'"
                :title="$t('lists.edit')"
                :aria-label="$t('lists.editA11y', { name: list.name })"
                @click="list.edit()"
            >
                <i-ic-baseline-edit class="h-5 w-5" />
            </IconButton>
        </div>
    </li>
</template>

<script setup lang="ts">
import { booleanProp, requiredObjectProp } from '@aerogel/core';
import { computed } from 'vue';

import TasksLists from '@/services/TasksLists';
import type TasksList from '@/models/TasksList';

const props = defineProps({
    list: requiredObjectProp<TasksList>(),
    editable: booleanProp(),
});
const isActive = computed(() => props.list.url === TasksLists.current?.url);
</script>
