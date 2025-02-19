<template>
    <div class="relative h-12 w-12">
        <button
            class="clickable-target flex h-full w-full rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[--primary-600]"
            type="button"
            :aria-label="$t('user.account')"
            :title="$t('user.account')"
            @click="$ui.openModal(CloudStatusModal)"
        >
            <AGSolidUserAvatar class="h-full w-full" />
            <div
                v-if="$cloud.syncing || $solid.loginOngoing"
                class="absolute -inset-1 animate-spin rounded-full border-2 border-[currentColor_transparent] text-green-500"
            />
        </button>
        <div
            class="pointer-events-none absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white"
            :class="[cloudStatusClass, { 'sr-only': $cloud.syncing || $solid.loginOngoing }]"
        >
            <span v-if="$solid.error || $cloud.syncError" class="sr-only">{{ $t(`cloud.status.error`) }}</span>
            <span v-else-if="$cloud.dirty && !$cloud.syncing" class="sr-only">{{ $t(`cloud.status.dirty`) }}</span>
            <span v-else class="sr-only">{{ $t(`cloud.status.${$cloud.status}`) }}</span>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Solid } from '@aerogel/plugin-solid';

import CloudStatusModal from '../../modals/CloudStatusModal.vue';
import { Cloud } from '@aerogel/plugin-offline-first';

const cloudStatusClass = computed(() => {
    if (Solid.error || Cloud.syncError) {
        return 'bg-red-500';
    }

    if (!Solid.isLoggedIn() || Cloud.dirty || !Cloud.ready) {
        return 'bg-yellow-500';
    }

    return 'bg-green-500';
});
</script>
