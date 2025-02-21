<template>
    <FloatingModal :title="$t('settings.title')">
        <SelectInput v-model="$lang.locale" class="flex flex-col items-start md:flex-row" as="div">
            <div class="md:mr-36">
                <SelectInputLabel class="text-base font-semibold">
                    {{ $t('settings.locale') }}
                </SelectInputLabel>
                <AGMarkdown
                    lang-key="settings.localeDescription"
                    :lang-params="{ url: `${$app.sourceUrl}/blob/main/docs/contribute-translations.md` }"
                    class="mt-1 text-sm text-gray-500"
                />
            </div>
            <TextButton :as="SelectInputButton" color="clear" class="-ml-3 mt-2 md:-ml-1 md:mt-0 md:text-sm">
                {{ localeName($lang.locale) }}
                <i-zondicons-cheveron-down class="ml-0.5 h-6 w-6" />
            </TextButton>
            <SelectInputOptions class="flex flex-col">
                <SelectInputOption v-for="locale in options" :key="locale" :value="locale">
                    {{ localeName(locale) }}
                </SelectInputOption>
            </SelectInputOptions>
        </SelectInput>
        <div v-if="$workspaces.usingLegacySchemas" class="mt-4 flex flex-row">
            <div class="flex-grow">
                <h3 class="text-base font-semibold">
                    {{ $t('settings.migrationTitle') }}
                </h3>
                <AGMarkdown :text="$t('settings.migrationDescription')" class="mt-1 text-sm text-gray-500" />
            </div>
            <TextButton color="secondary" class="self-center" @click="migrateSchemas()">
                {{ $t('settings.migrate') }}
            </TextButton>
        </div>
        <details v-if="!$solid.hasLoggedIn()" class="mt-4">
            <summary>
                <span class="text-base font-semibold">{{ $t('settings.dangerZone') }}</span>
            </summary>
            <TextButton color="danger" class="mt-4" @click="purgeData()">
                <i-zondicons-trash class="h-4 w-4" />
                <span class="ml-1">{{ $t('settings.purge') }}</span>
            </TextButton>
        </details>
    </FloatingModal>
</template>

<script setup lang="ts">
import { Colors, Lang, Storage, UI, translate } from '@aerogel/core';
import { computed } from 'vue';

import locales from '@/lang/locales.json';
import SelectInputButton from '@/components/forms/SelectInputButton.vue';
import Workspaces from '@/services/Workspaces';

import CloudLoginModal from './CloudLoginModal.vue';

const browserLocale = Lang.getBrowserLocale();
const options = computed(() => [null, ...Lang.locales]);

function localeName(locale: string | null): string {
    locale = locale ?? '';

    return locales[locale as 'en'] ?? translate('settings.localeDefault', { locale: locales[browserLocale as 'en'] });
}

async function migrateSchemas(): Promise<void> {
    await UI.closeAllModals();
    await UI.loading(translate('settings.migrationOngoing'), async () => {
        await Workspaces.migrateSchemas();
    });
}

async function purgeData(): Promise<void> {
    const confirmed = await UI.confirm(
        translate('settings.purgeConfirmTitle'),
        translate('settings.purgeConfirmMessage'),
        {
            acceptColor: Colors.Danger,
            acceptText: translate('settings.purgeConfirmAccept'),
            actions: {
                connect: () => UI.openModal(CloudLoginModal),
            },
        },
    );

    if (!confirmed) {
        return;
    }

    await UI.closeAllModals();
    await Storage.purge();
}
</script>
