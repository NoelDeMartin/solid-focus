<template>
    <FloatingModal :title="$t('settings.title')">
        <SelectInput v-model="$lang.locale" class="flex items-start" as="div">
            <div class="mr-36">
                <SelectInputLabel class="text-base font-semibold">
                    {{ $t('settings.locale') }}
                </SelectInputLabel>
                <AGMarkdown
                    lang-key="settings.localeDescription"
                    :lang-params="{ url: `${$app.sourceUrl}/blob/main/docs/contribute-translations.md` }"
                    class="mt-1 text-sm text-gray-500"
                />
            </div>
            <TextButton :as="SelectInputButton" color="clear" class="-ml-1 text-sm">
                {{ localeName($lang.locale) }}
                <i-zondicons-cheveron-down class="ml-0.5 h-6 w-6" />
            </TextButton>
            <SelectInputOptions class="flex flex-col">
                <SelectInputOption v-for="locale in options" :key="locale" :value="locale">
                    {{ localeName(locale) }}
                </SelectInputOption>
            </SelectInputOptions>
        </SelectInput>
    </FloatingModal>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Lang, translate } from '@aerogel/core';

import locales from '@/lang/locales.json';
import SelectInputButton from '@/components/forms/SelectInputButton.vue';

const browserLocale = Lang.getBrowserLocale();
const options = computed(() => [null, ...Lang.locales]);

function localeName(locale: string | null): string {
    locale = locale ?? '';

    return locales[locale as 'en'] ?? translate('settings.localeDefault', { locale: locales[browserLocale as 'en'] });
}
</script>
