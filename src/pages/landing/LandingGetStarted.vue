<template>
    <div class="mt-4 max-w-full sm:mt-8">
        <div v-if="$cloud.syncing" class="flex flex-col items-center">
            <AGMarkdown lang-key="landing.getStarted.syncing" class="mt-2 text-lg font-light text-gray-600" />
            <AGProgressBar
                v-if="$cloud.syncJob"
                :job="$cloud.syncJob"
                bar-class="bg-[--primary-600]"
                class="mt-2 min-w-[min(400px,80vw)]"
            />
            <TextButton v-if="$cloud.syncJob" class="mt-2" @click="$cloud.syncJob?.cancel()">
                {{ $t('ui.cancel') }}
            </TextButton>
        </div>

        <div v-else-if="$cloud.syncJob" class="flex flex-col items-center">
            <h1 class="mt-4 text-3xl font-semibold">
                {{ $t('landing.getStarted.syncCancelledTitle') }}
            </h1>
            <AGMarkdown
                lang-key="landing.getStarted.syncCancelledMessage"
                class="mt-2 text-lg font-light text-gray-600"
            />
            <div class="mt-4 flex flex-row-reverse justify-center gap-2">
                <TextButton @click="$cloud.sync()">
                    {{ $t('landing.getStarted.syncCancelledResume') }}
                </TextButton>
                <TextButton color="secondary" @click="cancel()">
                    {{ $t('landing.getStarted.syncCancelledLogout') }}
                </TextButton>
            </div>
        </div>

        <AGForm v-else :form="form" @submit="$ui.loading(submit())">
            <h2 class="text-center text-xl font-semibold leading-6 text-gray-900">
                {{ $t('landing.getStarted.title') }}
            </h2>

            <AGMarkdown lang-key="landing.getStarted.a11yIntro" :lang-params="{ issuesUrl }" class="sr-only" />

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

            <div v-if="loginError" class="mt-4 flex items-center gap-2 text-red-500">
                <i-ion-warning class="h-6 w-6" />
                <div>
                    <p>
                        <AGMarkdown lang-key="landing.getStarted.loginError" inline />
                    </p>
                    <TextLink
                        class="text-xs underline opacity-75 hover:opacity-100 focus-visible:opacity-100"
                        @click="$errors.inspect(loginError)"
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
import { App, Events, requiredStringInput, stringInput, translate, useForm } from '@aerogel/core';
import { Cloud } from '@aerogel/plugin-local-first';
import { computed } from 'vue';
import { Solid } from '@aerogel/plugin-solid';
import { urlResolve } from '@noeldemartin/utils';

import Workspace from '@/models/Workspace';

const form = useForm({
    draft: requiredStringInput(),
    workspaceName: requiredStringInput(translate('landing.getStarted.defaultWorkspaceName')),
    workspaceUrl: stringInput(undefined, { rules: Solid.hasLoggedIn() ? 'required|container_url' : '' }),
});
const issuesUrl = computed(() => urlResolve(App.sourceUrl ?? '', 'issues'));
const loginError = computed(() => Solid.previousSession?.error ?? Solid.loginStartupError ?? Cloud.syncError);

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
