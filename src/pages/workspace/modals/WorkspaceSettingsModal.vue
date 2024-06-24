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
            <div class="mt-8 flex w-full justify-end gap-3">
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
import { Cloud } from '@aerogel/plugin-offline-first';
import { computed, watchEffect } from 'vue';
import { componentRef, objectProp, requiredStringInput, useForm } from '@aerogel/core';

import SelectInputButton from '@/components/forms/SelectInputButton.vue';
import Workspace from '@/models/Workspace';
import { THEME_COLORS } from '@/utils/colors';
import type { IFloatingModal } from '@/components/modals/FloatingModal';
import type { ThemeColor } from '@/utils/colors';

const $modal = componentRef<IFloatingModal>();
const props = defineProps({ workspace: objectProp<Workspace>() });
const form = useForm({
    name: requiredStringInput(props.workspace?.name),
    color: requiredStringInput(props.workspace?.themeColor ?? 'sky'),
});
const colors = computed(() =>
    Object.entries(THEME_COLORS).map(([name, value]) => ({
        name,
        values: value,
    })));

async function submit(): Promise<void> {
    const updates = {
        name: form.name.trim(),
        color: form.color,
    };
    const workspace = await (props.workspace ? props.workspace.update(updates) : Workspace.create(updates));

    await workspace.open();
    await Cloud.syncIfOnline(workspace);

    $modal.value?.close();
}

watchEffect(() => {
    Object.entries(THEME_COLORS[form.color as ThemeColor]).forEach(([name, value]) => {
        $modal.value?.$panel?.$el?.style.setProperty(`--primary-${name}`, value);
    });
});
</script>
