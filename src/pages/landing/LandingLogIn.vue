<template>
    <div class="mt-8">
        <AGMarkdown v-if="$solid.loginStale" :text="$td('solid.loginStale', 'This is taking too long...')" />
        <AGMarkdown v-else-if="$solid.loginOngoing" :text="$td('ui.loading', 'Loading...')" />

        <AGForm
            v-else
            :form="form"
            class="mt-10 max-w-md"
            @submit="$solid.login(form.url)"
        >
            <AGMarkdown lang-key="landing.logIn.intro" class="leading-6 text-gray-900" />

            <div class="mt-4 flex flex-col items-center gap-y-2">
                <AGHeadlessInput name="url">
                    <AGHeadlessInputLabel class="sr-only">
                        {{ $t('landing.logIn.label') }}
                    </AGHeadlessInputLabel>
                    <AGHeadlessInputInput
                        class="w-[400px] min-w-0 flex-auto rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                        :placeholder="$t('landing.logIn.placeholder')"
                    />
                    <AGHeadlessInputError class="text-red-700" />
                </AGHeadlessInput>
                <AGHeadlessButton
                    submit
                    class="mt-2 w-[300px] rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                >
                    {{ $t('landing.logIn.submit') }}
                </AGHeadlessButton>
                <button
                    type="button"
                    class="mt-4 text-sm font-semibold leading-6 text-gray-900"
                    @click="$events.emit('landing:reset')"
                >
                    <span aria-hidden="true">←</span> {{ $t('landing.logIn.back') }}
                </button>
            </div>
        </AGForm>
    </div>
</template>

<script setup lang="ts">
import { requiredStringInput, useForm } from '@aerogel/core';

const form = useForm({ url: requiredStringInput() });
</script>
