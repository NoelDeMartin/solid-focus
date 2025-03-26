<template>
    <div v-if="$cloud.setupOngoing" class="flex flex-grow flex-col items-center justify-center p-8 text-center">
        <h1>{{ $t('cloud.setup.ongoing') }}</h1>
        <AGProgressBar bar-class="bg-[--primary-600]" class="mt-2 min-w-[min(400px,80vw)]" :job="$cloud.syncJob" />
    </div>
    <AGForm
        v-else
        :form="form"
        class="flex flex-grow flex-col items-center justify-center p-8 text-center"
        @submit="submit()"
    >
        <img src="@/assets/img/workspaces/setup.avif" class="w-96" alt="">
        <h1 class="mt-4 text-3xl font-semibold">
            {{ $t('cloud.setup.title') }}
        </h1>
        <AGMarkdown
            lang-key="cloud.setup.message"
            :lang-params="{ domain }"
            class="mt-2 text-lg font-light text-gray-600"
        />
        <AdvancedOptions class="mt-4 w-full max-w-prose text-start">
            <AGMarkdown lang-key="cloud.setup.advanced" class="text-gray-600" />
            <ul class="mt-2 space-y-2">
                <li v-for="(workspace, index) of $workspaces.all" :key="workspace.url">
                    <TextInput
                        :name="`workspaces.${index}`"
                        :label="$t('cloud.setup.workspaceUrl', { name: workspace.name })"
                    />
                </li>
            </ul>
        </AdvancedOptions>
        <div class="mt-4 flex flex-row-reverse justify-center gap-2">
            <TextButton submit>
                <i-ic-sharp-cloud-upload class="h-5 w-5" />
                <span class="ml-2">{{ $t('cloud.setup.submit') }}</span>
            </TextButton>
            <TextButton color="secondary" @click="$cloud.dismissSetup()">
                {{ $t('cloud.setup.dismiss') }}
            </TextButton>
        </div>
    </AGForm>
</template>

<script setup lang="ts">
import { Cloud } from '@aerogel/plugin-local-first';
import { computed } from 'vue';
import { required, urlParse } from '@noeldemartin/utils';
import { Solid } from '@aerogel/plugin-solid';
import { stringInput, useForm } from '@aerogel/core';
import type { SolidModelConstructor } from 'soukai-solid';
import type { FormFieldDefinition } from '@aerogel/core';

import TasksLists from '@/services/TasksLists';
import Workspace from '@/models/Workspace';
import Workspaces from '@/services/Workspaces';
import { mintWorkspaceUrl } from '@/utils/workspaces';

const remoteCollection = Cloud.requireRemoteCollection(Workspace);
const form = useForm(
    Workspaces.all.reduce((fields, workspace, index) => {
        fields[`workspaces.${index}`] = stringInput(mintWorkspaceUrl(remoteCollection, required(workspace.name)), {
            rules: 'required|container_url',
        });

        return fields;
    }, {} as Record<string, FormFieldDefinition>),
);
const domain = computed(() => {
    if (!Solid.user) {
        return;
    }

    return urlParse(Solid.user.storageUrls[0])?.['domain'];
});

async function submit() {
    const modelUrlMappings = new WeakMap<SolidModelConstructor, Record<string, string>>();

    modelUrlMappings.set(
        Workspace,
        Workspaces.all.reduce((mappings, workspace, index) => {
            mappings[workspace.url] = form.getFieldValue(`workspaces.${index}`) as string;

            return mappings;
        }, {} as Record<string, string>),
    );

    await Cloud.setup(modelUrlMappings);

    TasksLists.current || (await Workspaces.open());
}
</script>
