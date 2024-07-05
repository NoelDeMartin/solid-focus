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
                <TextButton submit class="w-full md:w-auto">
                    {{ $t('cloud.logIn.submit') }}
                </TextButton>
            </div>
        </AGForm>
    </FloatingModal>
</template>

<script setup lang="ts">
import { requiredStringInput, useForm } from '@aerogel/core';

const form = useForm({ url: requiredStringInput() });
</script>
