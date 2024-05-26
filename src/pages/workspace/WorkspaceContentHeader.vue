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
        <div class="flex h-12 w-12 items-center justify-center rounded-full bg-gray-200">
            <AGButton color="clear" :aria-label="$t('cloud.open')" @click="$ui.openModal(CloudStatusModal)">
                <div class="relative h-6 w-6">
                    <i-zondicons-cloud class="absolute inset-0 h-full w-full" />
                    <div class="absolute inset-0 flex items-center justify-center text-white">
                        <i-zondicons-refresh v-if="$cloud.syncing" class="h-3 w-3 animate-spin" />
                        <i-zondicons-close v-else-if="!$solid.hasLoggedIn() && $cloud.disconnected" class="h-3 w-3" />
                        <i-zondicons-checkmark v-else class="h-3 w-3" />
                    </div>
                    <span class="sr-only">{{ $t(`cloud.status.${$cloud.status}`) }}</span>
                </div>
            </AGButton>
        </div>
    </div>
</template>

<script setup lang="ts">
import CloudStatusModal from './modals/CloudStatusModal.vue';
</script>
