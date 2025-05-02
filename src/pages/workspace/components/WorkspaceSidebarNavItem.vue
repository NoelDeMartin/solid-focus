<template>
    <li class="group relative" :aria-current="isActive && 'page'">
        <div class="px-2 py-0.5">
            <HeadlessButton
                class="focus-visible:ring-primary-700 block rounded-lg px-4 py-3 hover:no-underline focus-visible:ring-2 focus-visible:outline-hidden focus-visible:ring-inset"
                :class="{
                    'hover:bg-primary-200 text-primary-900 bg-primary-100 font-semibold': isActive,
                    'hover:bg-gray-100': !isActive,
                }"
                v-bind="list.routeAttributes"
                @click="$ui.mobile && $workspaces.toggleSidebar()"
            >
                {{ $listName(list) }}
            </HeadlessButton>
        </div>
        <div
            v-if="editable"
            class="pointer-events-none absolute top-1/2 right-0 mr-2 -translate-y-1/2 overflow-hidden p-1"
        >
            <Button
                size="icon"
                variant="ghost"
                class="clickable-target pointer-events-auto size-9 translate-x-full rounded-md p-0 transition-transform group-hover:translate-x-0 focus:translate-x-0"
                :class="isActive && 'hover:bg-primary-200'"
                :title="$t('lists.edit')"
                :aria-label="$t('lists.editA11y', { name: list.name })"
                @click="list.edit()"
            >
                <i-ic-baseline-edit class="size-5" />
            </Button>
        </div>
    </li>
</template>

<script setup lang="ts">
import { computed } from 'vue';

import TasksLists from '@/services/TasksLists';
import type TasksList from '@/models/TasksList';

const { list } = defineProps<{
    list: TasksList;
    editable?: boolean;
}>();
const isActive = computed(() => list.url === TasksLists.current?.url);
</script>
