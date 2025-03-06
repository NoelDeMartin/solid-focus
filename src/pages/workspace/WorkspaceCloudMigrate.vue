<template>
    <div class="flex flex-grow flex-col items-center justify-center p-8 text-center">
        <template v-if="$cloud.migrating">
            <h1>{{ $t('cloud.migrate.ongoing') }}</h1>
            <AGProgressBar bar-class="bg-[--primary-600]" class="mt-2" :progress="progress" />
        </template>
        <template v-else>
            <img src="@/assets/img/workspaces/setup.avif" class="w-96" alt="">
            <h1 class="mt-4 text-3xl font-semibold">
                {{ $t('cloud.migrate.title') }}
            </h1>
            <AGMarkdown lang-key="cloud.migrate.message" class="mt-2 text-left text-lg font-light text-gray-600" />
            <TextLink
                class="mt-2 flex items-center self-end text-sm"
                :url="`${$app.sourceUrl}/blob/main/docs/migrate-schema.md`"
            >
                <span>{{ $t('cloud.migrate.learnMore') }}</span>
                <i-zondicons-arrow-right class="ml-1.5 size-2.5" />
            </TextLink>
            <div class="mt-4 flex flex-row-reverse justify-center gap-2">
                <TextButton @click="$cloud.migrate()">
                    {{ $t('cloud.migrate.submit') }}
                </TextButton>
                <TextButton color="secondary" @click="dismiss()">
                    {{ $t('cloud.migrate.dismiss') }}
                </TextButton>
            </div>
        </template>
    </div>
</template>

<script setup lang="ts">
import { Cloud } from '@aerogel/plugin-offline-first';
import { onMounted, onUnmounted, ref } from 'vue';
import { UI, translate, useEvent } from '@aerogel/core';
import type { JobListener } from '@aerogel/core';

const progress = ref(0);
const listener: JobListener = { onUpdated: (value) => (progress.value = value) };

async function dismiss() {
    await UI.confirm(translate('cloud.migrate.dismissTitle'), translate('cloud.migrate.dismissMessage'), {
        required: true,
    });

    Cloud.dismissMigration();
}

useEvent('cloud:migration-started', () => Cloud.migrationJob?.listeners.add(listener));
onMounted(() => Cloud.migrationJob?.listeners.add(listener));
onUnmounted(() => Cloud.migrationJob?.listeners.remove(listener));
</script>
