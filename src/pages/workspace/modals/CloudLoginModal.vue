<template>
    <FloatingModal :title="$t('cloud.logIn.title')">
        <AGForm :form="form" class="max-w-md" @submit="$solid.login(form.url)">
            <AGMarkdown lang-key="cloud.logIn.info" />
            <TextLink
                class="mt-2 text-sm opacity-50 hover:opacity-75 focus-visible:opacity-75"
                @click="$ui.alert($t('cloud.logIn.learnMore'), $t('cloud.logIn.learnMoreMessage'))"
            >
                {{ $t('cloud.logIn.learnMore') }}
            </TextLink>
            <div class="mt-4 flex flex-col items-center gap-2 md:flex-row">
                <TextInput
                    name="url"
                    :aria-label="$t('cloud.logIn.label')"
                    :placeholder="$t('cloud.logIn.placeholder')"
                    class="w-96 max-w-full"
                />
                <TextButton
                    v-if="showDevLogin"
                    submit
                    class="w-full md:w-auto"
                    @click="form.url = 'dev'"
                >
                    {{ $t('cloud.logIn.dev') }}
                </TextButton>
                <TextButton v-else submit class="w-full md:w-auto">
                    {{ $t('cloud.logIn.submit') }}
                </TextButton>
            </div>
        </AGForm>
    </FloatingModal>
</template>

<script setup lang="ts">
import { App, requiredStringInput, useForm } from '@aerogel/core';
import { computed } from 'vue';

const form = useForm({ url: requiredStringInput() });
const showDevLogin = computed(
    () => App.development && (!form.url || form.url === 'dev' || form.url.trim().length === 0),
);
</script>
