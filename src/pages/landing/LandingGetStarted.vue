<template>
    <div class="mt-8">
        <AGMarkdown v-if="$cloud.syncing" lang-key="cloud.status.syncing" />

        <AGForm
            v-else
            :form="form"
            class="mt-10"
            @submit="$ui.loading(submit())"
        >
            <h2 class="mt-6 text-xl font-semibold leading-6 text-gray-900">
                {{ $t('landing.getStarted.title') }}
            </h2>
            <AGMarkdown lang-key="landing.getStarted.intro" class="mt-2 text-center font-light text-gray-600" />

            <div class="mt-4 flex justify-center gap-2">
                <TextInput
                    name="draft"
                    class="w-80"
                    :aria-label="$t('landing.getStarted.label')"
                    :placeholder="$t('tasks.placeholder')"
                />
                <TextButton submit>
                    {{ $t('landing.getStarted.submit') }}
                </TextButton>
            </div>
            <TextButton
                v-if="!$solid.isLoggedIn()"
                color="clear"
                class="mx-auto mt-4 self-center px-3.5 py-2.5 text-sm font-semibold"
                @click="$events.emit('landing:reset')"
            >
                <i-zondicons-arrow-left class="h-3 w-3" />
                <span class="ml-1.5">{{ $t('landing.getStarted.back') }}</span>
            </TextButton>
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
