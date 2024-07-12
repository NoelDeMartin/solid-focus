<template>
    <AGHeadlessModal v-slot="{ close }" class="relative z-50">
        <div class="fixed inset-0 z-10 w-screen overflow-y-auto p-4 sm:p-6 md:p-20">
            <AGHeadlessModalPanel
                class="mx-auto max-w-xl transform divide-y divide-gray-100 overflow-hidden rounded-xl bg-white shadow-2xl ring-1 ring-black ring-opacity-5"
            >
                <Combobox @update:model-value="select($event), close()">
                    <div class="relative">
                        <i-zondicons-search class="pointer-events-none absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                        <ComboboxInput
                            class="h-12 w-full border-0 bg-transparent pl-11 pr-4 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm"
                            :placeholder="$t('workspace.searchPlaceholder')"
                            @change="query = $event.target.value"
                        />
                    </div>
                    <ComboboxOptions class="text-gray-80 max-h-72 overflow-y-auto text-sm" static>
                        <div v-if="results.length === 0 && query !== ''" class="p-4 text-sm text-gray-500">
                            {{ $t('workspace.searchEmpty') }}
                        </div>

                        <ComboboxOption
                            v-for="result in results"
                            :key="result.url"
                            v-slot="{ active }"
                            as="template"
                            :value="result"
                        >
                            <li class="cursor-pointer select-none p-1">
                                <div
                                    class="flex items-center gap-2 overflow-hidden rounded-lg p-2"
                                    :class="{
                                        'bg-[--primary-100]': active,
                                    }"
                                >
                                    <template v-if="result.task">
                                        <span class="sr-only">
                                            {{
                                                result.task.completed
                                                    ? $t('workspace.searchCompleted')
                                                    : $t('workspace.searchPending')
                                            }},
                                        </span>
                                        <i-zondicons-checkmark
                                            v-if="result.task.completed"
                                            class="h-5 w-5 flex-shrink-0"
                                        />
                                        <i-ic-twotone-access-time-filled v-else class="h-5 w-5 flex-shrink-0" />
                                        <AGMarkdown inline :text="result.task.name" class="truncate" />
                                    </template>
                                    <template v-else-if="result.list">
                                        <span class="sr-only">{{ $t('workspace.searchList') }},</span>
                                        <i-material-symbols-format-list-bulleted class="h-5 w-5 flex-shrink-0" />
                                        <AGMarkdown inline :text="$listName(result.list)" class="truncate" />
                                    </template>
                                    <template v-else>
                                        <span class="sr-only">{{ $t('workspace.searchWorkspace') }},</span>
                                        <i-mdi-briefcase class="h-5 w-5 flex-shrink-0" />
                                        <AGMarkdown inline :text="$workspaceName(result.workspace)" class="truncate" />
                                    </template>
                                </div>
                            </li>
                        </ComboboxOption>
                    </ComboboxOptions>
                </Combobox>
            </AGHeadlessModalPanel>
        </div>
    </AGHeadlessModal>
</template>

<script setup lang="ts">
import { ref } from 'vue';

import TasksLists from '@/services/TasksLists';
import Workspaces from '@/services/Workspaces';
import { useSearch } from '@/utils/search';
import type { SearchResult } from '@/utils/search';

const query = ref('');
const results = useSearch(query);

async function select(result: SearchResult) {
    if (!Workspaces.current?.is(result.workspace)) {
        await result.workspace.open();

        return;
    }

    if (result.list && !TasksLists.current?.is(result.list)) {
        await result.workspace.open(result.list);
    }

    result.task && Workspaces.select(result.task);
}
</script>
