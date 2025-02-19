<template>
    <div class="mt-8 max-w-full">
        <AGMarkdown v-if="$solid.loginStale" :text="$td('solid.loginStale', 'This is taking too long...')" />
        <AGMarkdown v-else-if="$solid.loginOngoing" :text="$td('ui.loading', 'Loading...')" />

        <AGForm
            v-else
            :form="form"
            class="mt-10 max-w-md"
            @submit="
                $solid.login(form.url, {
                    authenticator: form.authenticator,
                    loading: false,
                })
            "
        >
            <h2 class="mt-6 text-center text-xl font-semibold leading-6 text-gray-900">
                {{ $t('landing.logIn.title') }}
            </h2>

            <div class="mt-4 flex flex-col items-center gap-y-2">
                <TextInput
                    name="url"
                    :aria-label="$t('cloud.logIn.label')"
                    :placeholder="$t('cloud.logIn.placeholder')"
                    class="w-96 max-w-full"
                />
                <SelectInput
                    v-if="form.authenticator"
                    name="authenticator"
                    options-class="w-96 max-w-[calc(100vw-4rem)]"
                    :label="$t('landing.logIn.switchAuthenticatorLabel')"
                    :options="{
                        inrupt: $t('landing.logIn.switchAuthenticatorInrupt'),
                        legacy: $t('landing.logIn.switchAuthenticatorLegacy'),
                    }"
                />
                <TextButton submit class="w-full">
                    {{ $t('cloud.logIn.submit') }}
                </TextButton>
                <TextLink
                    v-if="!form.authenticator"
                    class="text-sm font-normal text-gray-700"
                    @click="form.authenticator = 'inrupt'"
                >
                    {{ $t('landing.logIn.switchAuthenticator') }}
                </TextLink>
                <TextButton
                    color="clear"
                    class="mx-auto self-center px-3.5 py-2.5 text-sm font-semibold"
                    @click="$events.emit('landing:reset')"
                >
                    <i-zondicons-arrow-left class="h-3 w-3" />
                    <span class="ml-1.5">{{ $t('landing.logIn.back') }}</span>
                </TextButton>
            </div>
        </AGForm>
    </div>
</template>

<script setup lang="ts">
import { requiredStringInput, stringInput, useForm } from '@aerogel/core';

const form = useForm({
    url: requiredStringInput(),
    authenticator: stringInput(),
});
</script>
