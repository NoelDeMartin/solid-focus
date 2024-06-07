<template>
    <Menu class="relative z-20" as="div">
        <IconButton :as="MenuButton" :aria-label="$t('user.settings')" :title="$t('user.settings')">
            <i-zondicons-cog class="h-5 w-5" />
        </IconButton>
        <MenuItems
            class="absolute right-0 mt-2 w-56 origin-top-right rounded-lg bg-white shadow-lg ring-1 ring-black/5 focus:outline-none"
        >
            <MenuItem v-slot="{ active }">
                <button
                    type="button"
                    :class="[
                        active ? 'bg-[--primary-500] text-white' : 'text-gray-900',
                        'group flex w-full items-center rounded-lg px-2 py-2 text-sm',
                    ]"
                    @click="$ui.openModal(CloudStatusModal)"
                >
                    {{ $t('user.logIn') }}
                </button>
            </MenuItem>
        </MenuItems>
    </Menu>
</template>

<script setup lang="ts">
import { MenuButton } from '@headlessui/vue';

import CloudStatusModal from '../../modals/CloudStatusModal.vue';
</script>
