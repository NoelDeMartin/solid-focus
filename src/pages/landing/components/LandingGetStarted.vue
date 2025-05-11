<template>
    <div class="mt-4 max-w-full px-3 sm:mt-8 md:px-0">
        <Form :form="form" @submit="submit()">
            <h2 class="text-center text-xl leading-6 font-semibold text-gray-900">
                {{ $t('landing.getStarted.title') }}
            </h2>

            <Markdown lang-key="landing.getStarted.a11yIntro" :lang-params="{ issuesUrl }" class="sr-only" />

            <Markdown
                lang-key="landing.getStarted.intro"
                class="mx-auto mt-2 max-w-lg text-center font-light text-gray-600"
            />

            <Input
                name="draft"
                class="mt-4 w-full"
                :aria-label="$t('tasks.inputLabel')"
                :placeholder="$t('tasks.inputPlaceholder')"
            />

            <div v-if="loginError" class="mt-4 flex items-center gap-2 text-start text-red-500">
                <i-ion-warning class="size-6" />
                <div>
                    <p>
                        <Markdown lang-key="landing.getStarted.loginError" inline />
                    </p>
                    <Link
                        class="text-xs text-red-500 underline opacity-75 hover:opacity-100 focus-visible:opacity-100"
                        @click="$errors.inspect(loginError)"
                    >
                        {{ $t('errors.viewDetails') }}
                    </Link>
                </div>
            </div>

            <AdvancedOptions v-if="$solid.hasLoggedIn()" class="mt-4">
                <Markdown lang-key="landing.getStarted.advanced.intro" class="text-gray-600" />
                <Input name="workspaceName" :label="$t('landing.getStarted.advanced.workspaceName')" class="mt-4" />
                <Input name="workspaceUrl" :label="$t('landing.getStarted.advanced.workspaceUrl')" class="mt-4" />
            </AdvancedOptions>

            <div class="mt-4 flex justify-between">
                <Button variant="ghost" class="px-3.5 py-2.5 text-sm font-semibold" @click="cancel()">
                    <i-zondicons-arrow-left class="size-3" />
                    <span class="ml-1.5">{{ $t('landing.getStarted.back') }}</span>
                </Button>
                <Button submit>
                    {{ $t('landing.getStarted.submit') }}
                </Button>
            </div>
        </Form>
    </div>
</template>

<script setup lang="ts">
import { App, Events, requiredStringInput, stringInput, translate, useForm } from '@aerogel/core';
import { Cloud } from '@aerogel/plugin-local-first';
import { computed } from 'vue';
import { Solid } from '@aerogel/plugin-solid';
import { urlResolve } from '@noeldemartin/utils';

import Workspace from '@/models/Workspace';
import { DEFAULT_COLOR } from '@/utils/theme';

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
        color: DEFAULT_COLOR,
    });

    await workspace.relatedTasks.create({ name: form.draft });
    await workspace.open();
}
</script>
