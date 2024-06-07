<template>
    <div class="mt-8">
        <AGMarkdown v-if="$cloud.syncing" lang-key="cloud.status.syncing" />

        <AGForm
            v-else
            :form="form"
            class="mt-10 max-w-md"
            @submit="$ui.loading(submit())"
        >
            <AGMarkdown lang-key="landing.getStarted.intro" class="leading-6 text-gray-900" />

            <div class="mt-4 flex gap-x-4">
                <AGHeadlessInput name="draft">
                    <AGHeadlessInputLabel class="sr-only">
                        {{ $t('landing.getStarted.label') }}
                    </AGHeadlessInputLabel>
                    <AGHeadlessInputInput
                        class="w-[400px] min-w-0 flex-auto rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                        :placeholder="$t('tasks.placeholder')"
                    />
                    <AGHeadlessInputError class="text-red-700" />
                </AGHeadlessInput>
                <AGHeadlessButton
                    submit
                    class="flex-none rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                >
                    {{ $t('landing.getStarted.submit') }}
                </AGHeadlessButton>
            </div>
            <button
                v-if="!$solid.isLoggedIn()"
                type="button"
                class="mt-4 text-sm font-semibold leading-6 text-gray-900"
                @click="$events.emit('landing:reset')"
            >
                <span aria-hidden="true">←</span> {{ $t('landing.getStarted.back') }}
            </button>
        </AGForm>
    </div>
</template>

<script setup lang="ts">
import { Cloud } from '@aerogel/plugin-offline-first';
import { requiredStringInput, translate, useForm } from '@aerogel/core';

import Task from '@/models/Task';
import Workspace from '@/models/Workspace';

const form = useForm({ draft: requiredStringInput() });

async function submit(): Promise<void> {
    const workspace = await Workspace.create({
        name: translate('landing.getStarted.workspaceName'),
        color: 'sky',
    });

    await workspace.relatedTasks.create({ name: form.draft, status: Task.STATUS_POTENTIAL });
    await Cloud.syncIfOnline();
    await workspace.open();
}
</script>
