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
        <UserStatus v-if="$solid.hasLoggedIn()" />
        <UserSettings v-else />
    </div>
</template>
