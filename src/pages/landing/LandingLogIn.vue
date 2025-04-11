<template>
    <div class="mt-8 max-w-full">
        <Markdown v-if="$solid.loginStale" :text="$td('solid.loginStale', 'This is taking too long...')" />
        <Markdown v-else-if="$solid.loginOngoing" :text="$td('ui.loading', 'Loading...')" />

        <Form
            v-else
            :form="form"
            class="mt-10 max-w-md"
            @submit="
                $solid.login(form.url, {
                    authenticator: form.authenticator as AuthenticatorName,
                    loading: false,
                })
            "
        >
            <h2 class="mt-6 text-center text-xl leading-6 font-semibold text-gray-900">
                {{ $t('landing.logIn.title') }}
            </h2>

            <div class="mt-4 flex flex-col items-center gap-y-2">
                <Input
                    name="url"
                    :aria-label="$t('cloud.logIn.label')"
                    :placeholder="$t('cloud.logIn.placeholder')"
                    class="w-96 max-w-full"
                />
                <Select
                    v-if="form.authenticator"
                    name="authenticator"
                    class="w-96 max-w-full"
                    label-class="sr-only"
                    options-class="w-96 max-w-[calc(100vw-4rem)]"
                    :label="$t('landing.logIn.switchAuthenticatorLabel')"
                    :options="authenticatorOptions"
                    :render-option="renderAuthenticator"
                />
                <Button
                    v-if="showDevLogin"
                    submit
                    class="w-full"
                    @click="form.url = 'dev'"
                >
                    {{ $t('cloud.logIn.dev') }}
                </Button>
                <Button v-else submit class="w-full">
                    {{ $t('cloud.logIn.submit') }}
                </Button>
                <Link
                    v-if="!form.authenticator"
                    class="text-sm font-normal text-gray-700"
                    @click="form.authenticator = 'inrupt'"
                >
                    {{ $t('landing.logIn.switchAuthenticator') }}
                </Link>
                <Button
                    variant="ghost"
                    class="mx-auto self-center px-3.5 py-2.5 text-sm font-semibold"
                    @click="$events.emit('landing:reset')"
                >
                    <i-zondicons-arrow-left class="size-3" />
                    <span>{{ $t('landing.logIn.back') }}</span>
                </Button>
            </div>
        </Form>
    </div>
</template>

<script setup lang="ts">
import { App, requiredStringInput, stringInput, translate, useForm } from '@aerogel/core';
import { computed } from 'vue';
import type { AuthenticatorName } from '@aerogel/plugin-solid';

const form = useForm({
    url: requiredStringInput(),
    authenticator: stringInput(),
});
const authenticatorOptions = ['inrupt', 'legacy'];
const showDevLogin = computed(
    () => App.development && (!form.url || form.url === 'dev' || form.url.trim().length === 0),
);

function renderAuthenticator(option: string) {
    return translate(`landing.logIn.switchAuthenticator${option.charAt(0).toUpperCase() + option.slice(1)}`);
}
</script>
