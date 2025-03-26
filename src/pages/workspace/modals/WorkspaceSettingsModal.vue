<template>
    <FloatingModal
        ref="$modal"
        v-slot="{ close }"
        :cancellable="false"
        :title="workspace ? $t('workspaces.edit') : $t('workspaces.add')"
        :subtitle="!workspace && $t('workspaces.description')"
    >
        <AGForm :form="form" class="mt-4 w-full" @submit="submit()">
            <div class="flex gap-4">
                <TextInput name="name" :label="$t('workspaces.name')" class="w-80 max-w-[80vw] flex-1" />
                <SelectInput name="color" as="div">
                    <SelectInputLabel>{{ $t('workspaces.color') }}</SelectInputLabel>
                    <TextButton :as="SelectInputButton" color="clear" class="-ml-3 mt-2 h-10">
                        <div class="h-4 w-4 rounded-full bg-[--primary-500]" />
                        <i-zondicons-cheveron-down class="ml-0.5 h-5 w-5" />
                    </TextButton>
                    <SelectInputOptions class="flex" placement="bottom-end">
                        <SelectInputOption v-for="color of colors" :key="color.name" :value="color.name">
                            <div class="p-2">
                                <div class="h-4 w-4 rounded-full" :style="`background: ${color.values[500]};`" />
                            </div>
                        </SelectInputOption>
                    </SelectInputOptions>
                </SelectInput>
            </div>
            <TextInput
                v-if="!mintUrl"
                name="url"
                class="mt-4"
                :label="$t('workspaces.url')"
            />
            <AdvancedOptions v-if="$cloud.ready" class="mt-4">
                <ul v-if="createsRemote" class="mb-4 flex flex-col gap-2">
                    <li>
                        <label class="flex items-center">
                            <input
                                v-model="mintUrl"
                                type="checkbox"
                                class="cursor-pointer rounded border-2 border-[--primary] text-[--primary-500] hover:bg-[--primary-100] checked:hover:text-[--primary-400] focus:ring-[--primary-500] focus-visible:ring-[--primary-500]"
                            >
                            <span class="ml-1.5">{{ $t('workspaces.advanced.mintUrl') }}</span>
                        </label>
                        <pre
                            v-if="mintUrl"
                            class="ml-6 mt-1 whitespace-normal text-xs text-gray-600"
                        ><code>{{ form.url }}</code></pre>
                    </li>
                </ul>

                <AGMarkdown
                    v-else
                    class="text-sm text-gray-600"
                    lang-key="workspaces.advanced.info"
                    :lang-params="{ url: form.url }"
                />
            </AdvancedOptions>
            <div class="flex w-full justify-end gap-3" :class="{ 'mt-2': $cloud.ready, 'mt-8': !$cloud.ready }">
                <TextButton color="secondary" @click="close()">
                    {{ $t('ui.cancel') }}
                </TextButton>

                <TextButton submit>
                    {{ workspace ? $t('ui.save') : $t('ui.create') }}
                </TextButton>
            </div>
        </AGForm>
    </FloatingModal>
</template>

<script setup lang="ts">
import { Cloud } from '@aerogel/plugin-local-first';
import { computed, ref, watchEffect } from 'vue';
import { UI, componentRef, objectProp, requiredStringInput, stringInput, useForm } from '@aerogel/core';

import SelectInputButton from '@/components/forms/SelectInputButton.vue';
import Workspace from '@/models/Workspace';
import Workspaces from '@/services/Workspaces';
import { mintWorkspaceUrl } from '@/utils/workspaces';
import { THEME_COLORS } from '@/utils/colors';
import type { IFloatingModal } from '@/components/modals/FloatingModal';
import type { ThemeColor } from '@/utils/colors';

const $modal = componentRef<IFloatingModal>();
const props = defineProps({ workspace: objectProp<Workspace>() });
const form = useForm({
    url: stringInput(props.workspace?.url, { rules: 'container_url' }),
    name: requiredStringInput(props.workspace?.name ?? ''),
    color: requiredStringInput(props.workspace?.themeColor ?? 'sky'),
});
const mintUrl = ref(true);
const createsRemote = computed(() => !props.workspace && Cloud.ready);
const colors = computed(() =>
    Object.entries(THEME_COLORS).map(([name, value]) => ({
        name,
        values: value,
    })));

async function submit(): Promise<void> {
    const updates = {
        url: form.url,
        name: form.name.trim(),
        color: form.color,
    };
    const workspace = await (props.workspace ? props.workspace.update(updates) : Workspace.create(updates));

    if (!props.workspace && UI.mobile) {
        Workspaces.toggleSidebar();
    }

    if (!Workspaces.current?.is(workspace)) {
        await workspace.open();
    }

    $modal.value?.close();
}

watchEffect(() => {
    Object.entries(THEME_COLORS[form.color as ThemeColor]).forEach(([name, value]) => {
        $modal.value?.$panel?.$el?.style.setProperty(`--primary-${name}`, value);
    });

    if (createsRemote.value && mintUrl.value) {
        form.url = mintWorkspaceUrl(form.name);
    }
});
</script>
