<template>
    <div class="flex-1">
        <aside
            v-measure="(size: ElementSize) => rootSize = size"
            class="fixed bottom-0 right-0 top-1 min-w-96 border-l p-8 pb-4 transition-transform will-change-transform"
            :class="{
                'translate-x-0': task,
                'translate-x-full': !task,
            }"
        >
            <AGForm
                v-if="task"
                :form="form"
                class="flex h-full flex-col"
                @submit="save()"
            >
                <AGMarkdown :text="task.name" class="sr-only" as="h2" />
                <AGMarkdown v-if="task.description" :text="task.description" class="sr-only" />
                <TextButton
                    v-if="!editing"
                    color="clear"
                    class="max-w-80 justify-start text-start"
                    :aria-label="$t('task.editName')"
                    :title="$t('task.editName')"
                    @click="startEditing('name')"
                >
                    <AGMarkdown :text="task.name" inline class="text-lg font-semibold" />
                </TextButton>
                <TextInput v-else name="name" input-class="max-w-80 text-lg font-semibold py-2 px-3" />
                <div class="mt-2 w-full">
                    <TextButton
                        v-if="!editing"
                        color="clear"
                        :aria-label="$t('task.editDescription')"
                        :title="$t('task.editDescription')"
                        class="min-h-12 w-full max-w-80 justify-start text-start"
                        :class="{ 'bg-gray-50': !task.description }"
                        @click="startEditing('description')"
                    >
                        <AGMarkdown v-if="task.description" :text="task.description" class="text-base" />
                        <AGMarkdown v-else lang-key="task.emptyDescription" class="text-sm text-gray-400" />
                    </TextButton>
                    <TaskDescriptionInput v-else name="description" input-class="max-w-80 text-base py-2 px-3" />
                </div>

                <div v-if="editing" class="mt-4 flex flex-row-reverse gap-2 self-end">
                    <TextButton submit>
                        {{ $t('task.save') }}
                    </TextButton>
                    <TextButton color="clear" @click="editing = false">
                        {{ $t('task.cancel') }}
                    </TextButton>
                </div>
                <div class="flex-1" />
                <div class="flex items-center justify-between">
                    <IconButton
                        :aria-label="$t('task.close')"
                        :title="$t('task.close')"
                        @click="$workspaces.select(null)"
                    >
                        <i-zondicons-cheveron-right class="h-5 w-5" />
                    </IconButton>
                    <span class="self-center text-sm text-gray-500">
                        {{
                            $t('tasks.created', {
                                date: task.createdAt.toLocaleDateString(undefined, {
                                    dateStyle: 'medium',
                                }),
                            })
                        }}
                    </span>
                    <IconButton
                        class="text-gray-500"
                        :aria-label="$t('task.remove')"
                        :title="$t('tasks.remove')"
                        @click="remove()"
                    >
                        <i-zondicons-trash class="h-5 w-5" />
                    </IconButton>
                </div>
            </AGForm>
        </aside>
        <div class="transition-[width]" :style="`width: ${task ? rootSize?.width : 0}px;`" />
    </div>
</template>

<script setup lang="ts">
import { computedModel } from '@aerogel/plugin-soukai';
import { UI, requiredStringInput, stringInput, translate, useForm } from '@aerogel/core';
import { ref } from 'vue';
import type { ElementSize } from '@aerogel/core';

import Workspaces from '@/services/Workspaces';

const rootSize = ref<ElementSize>();
const form = useForm({
    name: requiredStringInput(''),
    description: stringInput(''),
});
const editing = ref(false);
const task = computedModel(() => Workspaces.task);

function startEditing(field: string) {
    if (!task.value) {
        return;
    }

    form.name = task.value.name;
    form.description = task.value.description ?? '';
    editing.value = true;

    form.focus(field);
}

async function save() {
    if (!task.value || !editing.value) {
        return;
    }

    editing.value = false;

    await task.value.update({
        name: form.name.trim(),
        description: form.description?.trim() || null,
    });
}

async function remove() {
    if (!task.value || !(await UI.confirm(translate('task.confirmRemove')))) {
        return;
    }

    await task.value.delete();
}
</script>
