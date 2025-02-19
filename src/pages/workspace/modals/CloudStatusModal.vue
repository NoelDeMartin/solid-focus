<template>
    <FloatingModal ref="$modal">
        <div class="relative flex items-center rounded-md bg-gray-100 p-4 pr-12">
            <AGSolidUserAvatar class="mr-2 h-16 w-16 flex-shrink-0" />
            <div class="flex flex-col overflow-hidden">
                <span class="font-semibold">{{ $solid.user?.name ?? $t('user.anonymous') }}</span>
                <TextLink :url="$solid.user?.webId" class="mt-0.5 truncate text-sm font-light text-gray-500">
                    {{ $solid.user?.webId }}
                </TextLink>
            </div>

            <IconButton
                class="absolute right-1 top-1"
                :aria-label="$t('user.settings')"
                :title="$t('user.settings')"
                @click="$ui.openModal(UserSettingsModal)"
            >
                <i-zondicons-cog class="h-5 w-5" />
            </IconButton>
        </div>

        <div class="px-2">
            <div v-if="$cloud.syncing" class="mt-4 flex items-center gap-2">
                <i-zondicons-refresh class="mt-0.5 h-6 w-6 flex-shrink-0 animate-spin self-start text-green-500" />
                <AGMarkdown lang-key="cloud.info.syncing" />
            </div>
            <div v-else-if="$solid.loginOngoing" class="mt-4 flex items-center gap-2">
                <i-zondicons-refresh class="mt-0.5 h-6 w-6 flex-shrink-0 animate-spin self-start text-green-500" />
                <AGMarkdown lang-key="cloud.info.reconnecting" />
            </div>
            <div v-else-if="error" class="mt-4 flex items-center gap-2">
                <i-ion-warning class="mt-0.5 h-6 w-6 flex-shrink-0 self-start text-red-500" />
                <div>
                    <AGMarkdown :text="errorDescription" />
                    <TextLink
                        v-if="showErrorDetails"
                        class="text-sm underline opacity-50 hover:opacity-75 focus-visible:opacity-75"
                        @click="$errors.inspect(error)"
                    >
                        {{ $t('errors.viewDetails') }}
                    </TextLink>
                </div>
            </div>
            <div v-else-if="!$cloud.ready" class="mt-4 flex items-center gap-2">
                <i-ion-warning class="mt-0.5 h-6 w-6 flex-shrink-0 self-start text-yellow-500" />
                <AGMarkdown lang-key="cloud.info.setup" />
            </div>
            <div v-else-if="$cloud.dirty" class="mt-4 flex items-center gap-2">
                <i-ion-warning class="mt-0.5 h-6 w-6 flex-shrink-0 self-start text-yellow-500" />
                <AGMarkdown lang-key="cloud.info.changes" :lang-params="$cloud.localChanges" />
            </div>
            <div v-else-if="$cloud.online" class="mt-4 flex items-center gap-2">
                <i-zondicons-checkmark-outline class="mt-0.5 h-6 w-6 flex-shrink-0 self-start text-green-500" />
                <AGMarkdown lang-key="cloud.info.changes" :lang-params="0" />
            </div>
            <div v-else class="mt-4 flex items-center gap-2">
                <i-ion-warning class="mt-0.5 h-6 w-6 flex-shrink-0 self-start text-yellow-500" />
                <AGMarkdown lang-key="cloud.info.disconnected" />
            </div>
            <AdvancedOptions class="mt-2">
                <ul class="flex flex-col gap-2">
                    <li>
                        <label class="flex items-center">
                            <input
                                v-model="$solid.autoReconnect"
                                type="checkbox"
                                class="cursor-pointer rounded border-2 border-[--primary] text-[--primary-500] hover:bg-[--primary-100] checked:hover:text-[--primary-400] focus:ring-[--primary-500] focus-visible:ring-[--primary-500]"
                            >
                            <span class="ml-1.5">{{ $t('cloud.advanced.reconnect') }}</span>
                        </label>
                    </li>
                    <li>
                        <label class="flex items-center">
                            <input
                                v-model="$cloud.startupSync"
                                type="checkbox"
                                class="cursor-pointer rounded border-2 border-[--primary] text-[--primary-500] hover:bg-[--primary-100] checked:hover:text-[--primary-400] focus:ring-[--primary-500] focus-visible:ring-[--primary-500]"
                            >
                            <span class="ml-1.5">{{ $t('cloud.advanced.startupSync') }}</span>
                        </label>
                    </li>
                    <li class="flex items-center">
                        <input
                            v-model="$cloud.pollingEnabled"
                            type="checkbox"
                            class="cursor-pointer rounded border-2 border-[--primary] text-[--primary-500] hover:bg-[--primary-100] checked:hover:text-[--primary-400] focus:ring-[--primary-500] focus-visible:ring-[--primary-500]"
                            :aria-label="$t('cloud.advanced.pollingA11y')"
                        >
                        <div class="flex items-center">
                            <span class="ml-1.5" aria-hidden="true">{{ pollingText[0] }}</span>
                            <EditableContent
                                type="number"
                                :text="`${$cloud.pollingMinutes}`"
                                :aria-label="$t('cloud.advanced.pollingMinutes')"
                                class="mx-1 -mb-px border-b focus-within:border-[--primary-500]"
                                @update="$cloud.pollingMinutes = $event"
                            >
                                {{ $cloud.pollingMinutes }}
                            </EditableContent>
                            <span v-if="pollingText.length > 1" aria-hidden="true">{{ pollingText[1] }}</span>
                        </div>
                    </li>
                </ul>
            </AdvancedOptions>
        </div>

        <div v-if="!$cloud.syncing && !$solid.loginOngoing" class="mt-4 flex flex-row-reverse justify-start gap-2">
            <TextButton v-if="!$solid.isLoggedIn()" @click="$solid.reconnect({ force: true })">
                <i-zondicons-refresh class="h-5 w-5" />
                <span class="ml-1">{{ $t('cloud.reconnect') }}</span>
            </TextButton>
            <TextButton v-else-if="$cloud.ready" @click="$cloud.sync({ refreshUserProfile: true })">
                <i-zondicons-refresh class="h-5 w-5" />
                <span class="ml-1">{{ $t('cloud.sync') }}</span>
            </TextButton>
            <TextButton v-else @click="($cloud.setupDismissed = false), $modal?.close()">
                <i-ic-sharp-cloud-upload class="h-5 w-5" />
                <span class="ml-1">{{ $t('cloud.setup.submit') }}</span>
            </TextButton>
            <TextButton color="secondary" @click="$solid.logout()">
                <i-material-symbols-logout-rounded class="h-5 w-5" />
                <span class="ml-1">{{ $cloud.ready ? $t('cloud.logOut') : $t('cloud.disconnect') }}</span>
            </TextButton>
        </div>
    </FloatingModal>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Cloud } from '@aerogel/plugin-offline-first';
import { Solid } from '@aerogel/plugin-solid';
import { componentRef, translate, useEvent } from '@aerogel/core';

import type { IFloatingModal } from '@/components/modals/FloatingModal';

import UserSettingsModal from './UserSettingsModal.vue';

const $modal = componentRef<IFloatingModal>();
const pollingText = translate('cloud.advanced.polling', { minutes: '%%separator%%' }).split('%%separator%%');
const error = computed(() => Solid.error ?? Cloud.syncError);
const errorDescription = computed(() => {
    if (!error.value) {
        return;
    }

    if (typeof error.value === 'string') {
        return error.value;
    }

    return translate('cloud.info.error');
});
const showErrorDetails = computed(() => error.value && typeof error.value !== 'string');

useEvent('auth:logout', () => $modal.value?.close());
</script>
