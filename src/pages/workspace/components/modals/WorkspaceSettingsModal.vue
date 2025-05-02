<template>
    <Modal
        ref="$modalRef"
        v-slot="{ close }"
        :cancellable="false"
        :title="workspace ? $t('workspaces.edit') : $t('workspaces.add')"
        :description="workspace ? undefined : $t('workspaces.description')"
    >
        <Form :form="form" class="mt-4 w-full" @submit="submit()">
            <div class="flex gap-4">
                <Input name="name" :label="$t('workspaces.name')" class="w-80 max-w-[80vw] flex-1" />
                <Select name="color" :label="$t('workspaces.color')" align="end">
                    <Button :as="HeadlessSelectTrigger" variant="ghost" class="mt-1 -ml-3 h-10">
                        <HeadlessSelectValue class="bg-primary-500 size-4 rounded-full">
&nbsp;
                        </HeadlessSelectValue>
                        <i-zondicons-cheveron-down class="ml-0.5 size-6" />
                    </Button>
                    <SelectOptions inner-class="flex">
                        <SelectOption
                            v-for="(color, key) of COLORS"
                            :key
                            :value="color"
                            inner-class="px-4 py-3"
                        >
                            <div class="size-4 rounded-full" :style="{ background: color }" />
                        </SelectOption>
                    </SelectOptions>
                </Select>
            </div>
            <Input
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
                                class="text-primary-500 focus:ring-primary-500 focus-visible:ring-primary-500 hover:bg-primary-100 checked:hover:text-primary-400 border-primary-500 cursor-pointer rounded-sm border-2"
                            >
                            <span class="ml-1.5">{{ $t('workspaces.advanced.mintUrl') }}</span>
                        </label>
                        <pre
                            v-if="mintUrl"
                            class="mt-1 ml-6 text-xs whitespace-normal text-gray-600"
                        ><code>{{ form.url }}</code></pre>
                    </li>
                </ul>

                <Markdown
                    v-else
                    class="text-sm text-gray-600"
                    lang-key="workspaces.advanced.info"
                    :lang-params="{ url: form.url }"
                />
            </AdvancedOptions>
            <div class="flex w-full justify-end gap-3" :class="{ 'mt-2': $cloud.ready, 'mt-8': !$cloud.ready }">
                <Button variant="secondary" @click="close()">
                    {{ $t('ui.cancel') }}
                </Button>

                <Button submit>
                    {{ workspace ? $t('ui.save') : $t('ui.create') }}
                </Button>
            </div>
        </Form>
    </Modal>
</template>

<script setup lang="ts">
import { Cloud } from '@aerogel/plugin-local-first';
import { computed, ref, useTemplateRef, watchEffect } from 'vue';
import { HeadlessSelectTrigger, UI, requiredStringInput, stringInput, useForm } from '@aerogel/core';

import Workspace from '@/models/Workspace';
import Workspaces from '@/services/Workspaces';
import { mintWorkspaceUrl } from '@/utils/workspaces';
import { COLORS, DEFAULT_COLOR, setThemeVariables } from '@/utils/theme';

const { workspace } = defineProps<{ workspace?: Workspace }>();
const $modal = useTemplateRef('$modalRef');
const form = useForm({
    url: stringInput(workspace?.url, { rules: 'container_url' }),
    name: requiredStringInput(workspace?.name ?? ''),
    color: requiredStringInput(workspace?.color ?? DEFAULT_COLOR),
});
const mintUrl = ref(true);
const createsRemote = computed(() => !workspace && Cloud.ready);

async function submit(): Promise<void> {
    const updates = {
        url: form.url,
        name: form.name.trim(),
        color: form.color,
    };
    const formWorkspace = await (workspace ? workspace.update(updates) : Workspace.create(updates));

    if (!workspace && UI.mobile) {
        Workspaces.toggleSidebar();
    }

    if (!Workspaces.current?.is(formWorkspace)) {
        await formWorkspace.open();
    }

    $modal.value?.close();
}

watchEffect(() => {
    $modal.value?.$content?.$el && setThemeVariables($modal.value.$content.$el, form.color);

    if (createsRemote.value && mintUrl.value) {
        form.url = mintWorkspaceUrl(form.name);
    }
});
</script>
