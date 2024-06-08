<template>
    <div class="flex flex-col items-center text-center">
        <img src="@/assets/img/workspaces/setup.avif" class="w-96" alt="">
        <h1 class="mt-4 text-3xl font-semibold">
            {{ $t('cloud.setup.title') }}
        </h1>
        <AGMarkdown
            lang-key="cloud.setup.message"
            :lang-params="{ domain }"
            class="mt-2 text-lg font-light text-gray-600"
        />
        <div class="mt-4 flex flex-row-reverse justify-center gap-2">
            <TextButton @click="$ui.loading($cloud.setup())">
                <i-ic-sharp-cloud-upload class="h-5 w-5" />
                <span class="ml-2">{{ $t('cloud.setup.submit') }}</span>
            </TextButton>
            <TextButton color="secondary" @click="$cloud.dismissSetup()">
                {{ $t('cloud.setup.dismiss') }}
            </TextButton>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Solid } from '@aerogel/plugin-solid';
import { urlParse } from '@noeldemartin/utils';

const domain = computed(() => {
    if (!Solid.user) {
        return;
    }

    return urlParse(Solid.user.storageUrls[0])?.['domain'];
});
</script>
