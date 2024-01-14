<template>
    <div class="flex flex-col items-center">
        <h1 class="text-2xl font-semibold">
            {{ $t('onboarding.title') }}
        </h1>
        <AGForm class="mt-4 flex" :form="form" @submit="$ui.loading(submit())">
            <AGInput
                v-initial-focus
                name="draft"
                :placeholder="$t('onboarding.draft_placeholder')"
                :aria-label="$t('onboarding.draft_label')"
            />
            <AGButton submit>
                {{ $t('onboarding.submit') }}
            </AGButton>
        </AGForm>
    </div>
</template>

<script setup lang="ts">
import { requiredStringInput, translate, useForm } from '@aerogel/core';

import Workspace from '@/models/Workspace';
import Task from '@/models/Task';
import Workspaces from '@/services/Workspaces';

const form = useForm({
    draft: requiredStringInput(),
});

async function submit(): Promise<void> {
    const task = await Task.create({ name: form.draft });
    const workspace = await Workspace.create({
        name: translate('onboarding.workspaceName'),
        taskIds: [task.id],
    });

    Workspaces.open(workspace);
}
</script>
