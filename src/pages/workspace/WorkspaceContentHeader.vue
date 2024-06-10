<template>
    <div v-if="$tasksLists.current" class="flex items-center px-4 py-6">
        <IconButton
            class="p-1.5"
            :aria-label="$workspaces.sidebar ? $t('workspaces.hideSidebar') : $t('workspaces.openSidebar')"
            @click="$workspaces.toggleSidebar()"
        >
            <i-tabler-layout-sidebar-filled class="h-6 w-6" />
        </IconButton>
        <h1 class="ml-1 text-xl font-semibold">
            {{ $listName($tasksList) }}
        </h1>
        <div class="flex-grow" />
        <IconButton
            :aria-label="$t('workspace.search')"
            :title="$t('workspace.search')"
            class="mr-2"
            @click="$ui.openModal(WorkspaceSearchModal)"
        >
            <i-zondicons-search class="h-5 w-5" />
        </IconButton>
        <UserStatus v-if="$solid.hasLoggedIn()" />
        <UserSettings v-else />
    </div>
</template>

<script setup lang="ts">
import { UI } from '@aerogel/core';

import { watchKeyboardShortcut } from '@/utils/composables';

import WorkspaceSearchModal from './modals/WorkspaceSearchModal.vue';

watchKeyboardShortcut('s', () => UI.openModal(WorkspaceSearchModal));
</script>
