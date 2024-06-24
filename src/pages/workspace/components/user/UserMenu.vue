<template>
    <Menu class="relative z-20" as="div">
        <IconButton :as="MenuButton" :aria-label="$t('user.menu')" :title="$t('user.menu')">
            <i-zondicons-cog class="h-5 w-5" />
        </IconButton>

        <MenuItems
            class="absolute right-0 mt-2 w-56 origin-top-right gap-y-0.5 rounded-lg bg-white p-1.5 shadow-lg ring-1 ring-black/5 focus:outline-none"
        >
            <MenuItem v-slot="{ active }">
                <AGHeadlessButton
                    class="group flex w-full items-center rounded-lg px-2 py-2 text-sm text-gray-900"
                    :class="active && 'bg-gray-100'"
                    @click="$ui.openModal(CloudLoginModal)"
                >
                    {{ $t('user.logIn') }}
                </AGHeadlessButton>
            </MenuItem>
            <MenuItem v-slot="{ active }">
                <AGHeadlessButton
                    class="group flex w-full items-center rounded-lg px-2 py-2 text-sm text-gray-900"
                    :class="active && 'bg-gray-100'"
                    @click="$ui.openModal(UserSettingsModal)"
                >
                    {{ $t('user.settings') }}
                </AGHeadlessButton>
            </MenuItem>
        </MenuItems>
    </Menu>
</template>

<script setup lang="ts">
import { MenuButton } from '@headlessui/vue';

import CloudLoginModal from '../../modals/CloudLoginModal.vue';
import UserSettingsModal from '../../modals/UserSettingsModal.vue';
</script>
