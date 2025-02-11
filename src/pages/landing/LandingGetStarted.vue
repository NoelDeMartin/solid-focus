<template>
    <div class="mt-4 max-w-full sm:mt-8">
        <AGMarkdown v-if="$cloud.syncing" lang-key="cloud.status.syncing" />

        <AGForm v-else :form="form" @submit="$ui.loading(submit())">
            <h2 class="text-center text-xl font-semibold leading-6 text-gray-900">
                {{ $t('landing.getStarted.title') }}
            </h2>

            <AGMarkdown
                lang-key="landing.getStarted.intro"
                class="mx-auto mt-2 max-w-lg text-center font-light text-gray-600"
            />

            <TextInput
                name="draft"
                class="mt-4 w-full"
                :aria-label="$t('tasks.inputLabel')"
                :placeholder="$t('tasks.inputPlaceholder')"
            />

            <div
                v-if="$solid.previousSession?.error || $solid.loginStartupError"
                class="mt-4 flex items-center gap-2 text-red-500"
            >
                <i-ion-warning class="h-6 w-6" />
                <div>
                    <p>
                        <AGMarkdown lang-key="landing.getStarted.loginError" inline />
                    </p>
                    <TextLink
                        class="text-xs underline opacity-75 hover:opacity-100 focus-visible:opacity-100"
                        @click="$errors.inspect($solid.previousSession?.error || $solid.loginStartupError)"
                    >
                        {{ $t('errors.viewDetails') }}
                    </TextLink>
                </div>
            </div>

            <AdvancedOptions v-if="$solid.hasLoggedIn()" class="mt-4">
                <AGMarkdown lang-key="landing.getStarted.advanced.intro" class="text-gray-600" />
                <TextInput name="workspaceName" :label="$t('landing.getStarted.advanced.workspaceName')" class="mt-4" />
                <TextInput name="workspaceUrl" :label="$t('landing.getStarted.advanced.workspaceUrl')" class="mt-4" />
            </AdvancedOptions>

            <div class="mt-4 flex justify-between">
                <TextButton color="clear" class="px-3.5 py-2.5 text-sm font-semibold" @click="cancel()">
                    <i-zondicons-arrow-left class="h-3 w-3" />
                    <span class="ml-1.5">{{ $t('landing.getStarted.back') }}</span>
                </TextButton>
                <TextButton submit>
                    {{ $t('landing.getStarted.submit') }}
                </TextButton>
            </div>
        </AGForm>
    </div>
</template>

<script setup lang="ts">
import { Events, requiredStringInput, stringInput, translate, useForm } from '@aerogel/core';
import { Solid } from '@aerogel/plugin-solid';

import Workspace from '@/models/Workspace';

const form = useForm({
    draft: requiredStringInput(),
    workspaceName: requiredStringInput(translate('landing.getStarted.defaultWorkspaceName')),
    workspaceUrl: stringInput(undefined, { rules: Solid.hasLoggedIn() ? 'required|container_url' : '' }),
});

if (Solid.hasLoggedIn()) {
    const workspace = new Workspace({ name: form.workspaceName });

    workspace.mintUrl();

    form.workspaceUrl = workspace.url;
}

async function cancel() {
    if (Solid.hasLoggedIn()) {
        await Solid.logout(true);
    }

    await Events.emit('landing:reset');
}

async function submit(): Promise<void> {
    const workspace = await Workspace.create({
        url: form.workspaceUrl,
        name: form.workspaceName,
        color: 'sky',
    });

    await workspace.relatedTasks.create({ name: form.draft });
    await workspace.open();
}
</script>
