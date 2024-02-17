<template>
    <div class="flex flex-col items-center">
        <h1 class="text-2xl font-semibold">
            {{ $t('onboarding.title') }}
        </h1>
        <AGForm
            v-if="!$solid.isLoggedIn()"
            class="mt-4 flex"
            :form="form"
            @submit="$ui.loading(submit())"
        >
            <AGInput
                v-initial-focus
                name="draft"
                :placeholder="$t('onboarding.draftTask_placeholder')"
                :aria-label="$t('onboarding.draftTask_label')"
            />
            <AGButton submit>
                {{ $t('onboarding.submitTask') }}
            </AGButton>
        </AGForm>
        <AGForm
            v-else
            class="mt-4 flex"
            :form="form"
            @submit="$ui.loading(submit())"
        >
            <AGInput
                v-initial-focus
                name="draft"
                :placeholder="$t('onboarding.draftWorkspace_placeholder')"
                :aria-label="$t('onboarding.draftWorkspace_label')"
            />
            <AGButton submit>
                {{ $t('onboarding.submitWorkspace') }}
            </AGButton>
        </AGForm>
        <AGSolidStatus class="mt-6" />
    </div>
</template>

<script setup lang="ts">
import { Cloud } from '@aerogel/plugin-offline-first';
import { requiredStringInput, translate, useForm } from '@aerogel/core';
import { Solid } from '@aerogel/plugin-solid';

import Task from '@/models/Task';
import Workspace from '@/models/Workspace';

const form = useForm({
    draft: requiredStringInput(),
});

async function createLocalWorkspace(): Promise<Workspace> {
    const workspace = await Workspace.create({ name: translate('onboarding.workspaceName') });

    await workspace.relatedTasks.create({
        name: form.draft,
        status: Task.STATUS_POTENTIAL,
    });

    return workspace;
}

async function createCloudWorkspace(): Promise<Workspace> {
    await Cloud.setup();

    const workspace = await Workspace.create({ name: form.draft });

    await Cloud.sync();

    return workspace;
}

async function submit(): Promise<void> {
    const workspace = Solid.isLoggedIn() ? await createCloudWorkspace() : await createLocalWorkspace();

    await workspace.open();
}
</script>
