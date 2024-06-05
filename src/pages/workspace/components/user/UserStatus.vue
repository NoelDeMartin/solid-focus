<template>
    <div class="relative h-12 w-12">
        <button
            class="clickable-target flex h-full w-full items-center justify-center rounded-full bg-gray-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[--primary-600]"
            type="button"
            :aria-label="$t('user.account')"
            :title="$t('user.account')"
            @click="$ui.openModal(CloudStatusModal)"
        >
            <AGSolidImage
                v-if="$solid.user?.avatarUrl"
                :src="$solid.user?.avatarUrl"
                alt=""
                class="absolute inset-0 h-full w-full rounded-full"
            />
            <span class="text-sm font-semibold tracking-wider text-gray-500" aria-hidden="true">
                {{ userInitials }}
            </span>
        </button>
        <div
            class="pointer-events-none absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white"
            :class="cloudStatusClass"
        >
            <span class="sr-only">{{ $t(`cloud.status.${$cloud.status}`) }}</span>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Solid } from '@aerogel/plugin-solid';

import CloudStatusModal from '../../modals/CloudStatusModal.vue';

const userInitials = computed(() => {
    const name = Solid.user?.name ?? '?';

    return name
        .split(' ')
        .map((part) => part[0]?.toUpperCase())
        .join('')
        .slice(0, 3);
});
const cloudStatusClass = computed(() => {
    if (Solid.error) {
        return 'bg-red-500';
    }

    if (!Solid.isLoggedIn()) {
        return 'bg-yellow-500';
    }

    return 'bg-green-500';
});
</script>
