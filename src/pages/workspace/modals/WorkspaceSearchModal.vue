<template>
    <HeadlessModal v-slot="{ close }" class="relative z-50">
        <HeadlessModalOverlay class="fixed inset-0 bg-black/30" />
        <HeadlessModalContent
            :aria-describedby="undefined"
            class="fixed top-4 left-1/2 z-10 w-full max-w-[calc(100vw-(--spacing(8)))] -translate-x-1/2 sm:top-6 md:top-20 md:max-w-xl"
        >
            <HeadlessModalTitle class="sr-only">
                {{ $t('workspace.search') }}
            </HeadlessModalTitle>

            <ComboboxRoot
                open
                ignore-filter
                :by="(a, b) => a === b"
                class="ring-opacity-5 mx-auto w-full transform divide-y divide-gray-100 overflow-hidden rounded-xl bg-white shadow-2xl ring-1 ring-black/5"
                @update:model-value="(select($event), close())"
            >
                <ComboboxAnchor class="relative">
                    <i-zondicons-search class="pointer-events-none absolute top-3.5 left-4 size-5 text-gray-400" />
                    <ComboboxInput
                        v-model="query"
                        class="h-12 w-full border-0 bg-transparent pr-4 pl-11 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm"
                        :placeholder="$t('workspace.searchPlaceholder')"
                        @keydown.esc="close()"
                    />
                </ComboboxAnchor>
                <ComboboxContent>
                    <ComboboxViewport
                        class="max-h-72 overflow-y-auto text-sm text-gray-800"
                        style="scrollbar-width: auto"
                    >
                        <ComboboxEmpty class="p-4 text-sm text-gray-500">
                            {{ $t('workspace.searchEmpty') }}
                        </ComboboxEmpty>

                        <ComboboxItem
                            v-for="result in results"
                            :key="result.key"
                            :value="result"
                            class="group cursor-pointer p-1 select-none"
                        >
                            <div
                                class="group-data-[highlighted]:bg-primary-100 flex items-center gap-2 overflow-hidden rounded-lg p-2"
                            >
                                <template v-if="result.task">
                                    <span class="sr-only">
                                        {{
                                            result.task.completed
                                                ? $t('workspace.searchCompleted')
                                                : $t('workspace.searchPending')
                                        }},
                                    </span>
                                    <i-zondicons-checkmark v-if="result.task.completed" class="size-5 shrink-0" />
                                    <i-ic-twotone-access-time-filled v-else class="size-5 shrink-0" />
                                    <Markdown inline :text="result.task.name" class="truncate" />
                                </template>
                                <template v-else-if="result.list">
                                    <span class="sr-only">{{ $t('workspace.searchList') }},</span>
                                    <i-material-symbols-format-list-bulleted class="size-5 shrink-0" />
                                    <Markdown inline :text="$listName(result.list)" class="truncate" />
                                </template>
                                <template v-else>
                                    <span class="sr-only">{{ $t('workspace.searchWorkspace') }},</span>
                                    <i-mdi-briefcase class="size-5 shrink-0" />
                                    <Markdown inline :text="$workspaceName(result.workspace)" class="truncate" />
                                </template>
                            </div>
                        </ComboboxItem>
                    </ComboboxViewport>
                </ComboboxContent>
            </ComboboxRoot>
        </HeadlessModalContent>
    </HeadlessModal>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { AcceptableValue } from 'reka-ui';

import Tasks from '@/services/Tasks';
import TasksLists from '@/services/TasksLists';
import Workspaces from '@/services/Workspaces';
import { useSearch } from '@/utils/search';
import type { SearchResult } from '@/utils/search';

const query = ref('');
const results = useSearch(query);

async function select(value: AcceptableValue) {
    const result = value as SearchResult;

    if (!Workspaces.current?.is(result.workspace)) {
        await result.workspace.open();

        return;
    }

    if (result.list && !TasksLists.current?.is(result.list)) {
        await result.workspace.open(result.list);
    }

    result.task && Tasks.select(result.task);
}
</script>
