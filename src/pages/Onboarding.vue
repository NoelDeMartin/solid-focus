<template>
    <div class="flex flex-col items-center">
        <h1 class="text-2xl font-semibold">
            {{ $t('onboarding.title') }}
        </h1>
        <span v-if="$cloud.syncing">
            {{ $t('cloud.status.syncing') }}
        </span>
        <AGForm
            v-else
            class="mt-4 flex"
            :form="form"
            @submit="$ui.loading(submit())"
        >
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
        <AGSolidStatus class="mt-6" />
    </div>
</template>

<script setup lang="ts">
import { Cloud } from '@aerogel/plugin-offline-first';
import { requiredStringInput, translate, useEvent, useForm } from '@aerogel/core';

import Task from '@/models/Task';
import Workspace from '@/models/Workspace';
import Workspaces from '@/services/Workspaces';

const form = useForm({ draft: requiredStringInput() });

async function submit(): Promise<void> {
    const workspace = await Workspace.create({ name: translate('onboarding.workspaceName') });

    await workspace.relatedTasks.create({ name: form.draft, status: Task.STATUS_POTENTIAL });
    await Cloud.syncIfOnline();
    await workspace.open();
}

useEvent('cloud:sync-completed', () => Workspaces.open());
</script>
