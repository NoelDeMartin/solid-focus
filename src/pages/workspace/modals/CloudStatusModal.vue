<template>
    <FloatingModal>
        <div class="relative flex items-center rounded-md bg-gray-100 p-4 pr-12">
            <AGSolidUserAvatar class="mr-2 h-16 w-16" />
            <div class="flex flex-col">
                <span class="font-semibold">{{ $solid.user?.name }}</span>
                <AGLink :url="$solid.user?.webId" class="mt-0.5 text-sm font-light text-gray-500">
                    {{ $solid.user?.webId }}
                </AGLink>
            </div>

            <IconButton class="absolute right-1 top-1">
                <i-zondicons-cog class="h-5 w-5" />
            </IconButton>
        </div>

        <div v-if="$cloud.syncing" class="mt-4 flex items-center gap-2">
            <i-zondicons-refresh class="mt-0.5 h-6 w-6 animate-spin self-start text-green-500" />
            <AGMarkdown lang-key="cloud.info.syncing" />
        </div>

        <div v-else-if="$solid.loginOngoing" class="mt-4 flex items-center gap-2">
            <i-zondicons-refresh class="mt-0.5 h-6 w-6 animate-spin self-start text-green-500" />
            <AGMarkdown lang-key="cloud.info.reconnecting" />
        </div>

        <div v-else-if="!$cloud.ready" class="mt-4 flex items-center gap-2">
            <i-ion-warning class="mt-0.5 h-6 w-6 self-start text-yellow-500" />
            <AGMarkdown lang-key="cloud.info.setup" />
        </div>

        <div v-else-if="$cloud.dirty" class="mt-4 flex items-center gap-2">
            <i-ion-warning class="mt-0.5 h-6 w-6 self-start text-yellow-500" />
            <AGMarkdown lang-key="cloud.info.changes" :lang-params="$cloud.localChanges" />
        </div>

        <div v-else-if="$cloud.online" class="mt-4 flex items-center gap-2">
            <i-zondicons-checkmark-outline class="mt-0.5 h-6 w-6 self-start text-green-500" />
            <AGMarkdown lang-key="cloud.info.changes" :lang-params="0" />
        </div>

        <div v-else-if="$solid.error" class="mt-4 flex items-center gap-2">
            <i-ion-warning class="mt-0.5 h-6 w-6 self-start text-red-500" />
            <div>
                <AGMarkdown :text="errorDescription" />
                <AGLink
                    v-if="showErrorDetails"
                    class="text-sm underline opacity-50 hover:opacity-75"
                    @click="$errors.inspect($solid.error)"
                >
                    {{ $t('ui.viewDetails') }}
                </AGLink>
            </div>
        </div>

        <div v-else class="mt-4 flex items-center gap-2">
            <i-ion-warning class="mt-0.5 h-6 w-6 self-start text-yellow-500" />
            <AGMarkdown lang-key="cloud.info.disconnected" />
        </div>

        <div v-if="!$cloud.syncing && !$solid.loginOngoing" class="mt-4 flex flex-row-reverse justify-start gap-2">
            <TextButton v-if="!$solid.isLoggedIn()" @click="$solid.reconnect({ force: true })">
                <i-zondicons-refresh class="h-5 w-5" />
                <span class="ml-1">{{ $t('cloud.reconnect') }}</span>
            </TextButton>
            <TextButton v-else-if="$cloud.ready" @click="$cloud.sync()">
                <i-zondicons-refresh class="h-5 w-5" />
                <span class="ml-1">{{ $t('cloud.sync') }}</span>
            </TextButton>
            <TextButton v-else>
                <i-ic-sharp-cloud-upload class="h-5 w-5" />
                <span class="ml-1">{{ $t('cloud.setup.submit') }}</span>
            </TextButton>
            <TextButton color="secondary" @click="$solid.logout()">
                <i-material-symbols-logout-rounded class="h-5 w-5" />
                <span class="ml-1">{{ $t('cloud.logOut') }}</span>
            </TextButton>
        </div>
    </FloatingModal>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Solid } from '@aerogel/plugin-solid';
import { translate } from '@aerogel/core';

const errorDescription = computed(() => {
    if (!Solid.error) {
        return;
    }

    if (typeof Solid.error === 'string') {
        return Solid.error;
    }

    return translate('cloud.info.error');
});
const showErrorDetails = computed(() => Solid.error && typeof Solid.error !== 'string');
</script>
