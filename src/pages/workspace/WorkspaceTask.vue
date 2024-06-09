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
                <span class="sr-only">{{
                    task.important ? $t('task.importantA11y') : $t('task.notImportantA11y')
                }}</span>
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
                <TextInput
                    v-else
                    multiline
                    name="name"
                    input-class="max-w-80 text-lg font-semibold py-2 px-3"
                />

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

                <TextButton
                    v-if="!editing"
                    color="clear"
                    class="mt-2 self-start"
                    :title="$t('task.editDueDate')"
                    :aria-label="$t('task.editDueDate')"
                    @click="startEditing('dueDate')"
                >
                    <i-material-symbols-calendar-clock-rounded class="h-6 w-6 text-gray-500" />
                    <span class="ml-1">
                        {{ renderedDueDate ? $t('task.due', { date: renderedDueDate }) : $t('task.notDue') }}
                    </span>
                </TextButton>
                <DateInput v-else name="dueDate" class="mt-2" />

                <TextButton
                    color="clear"
                    class="mt-2 self-start"
                    :title="task.important ? $t('task.removeImportant') : $t('task.makeImportant')"
                    :aria-label="task.important ? $t('task.removeImportant') : $t('task.makeImportant')"
                    @click="toggleImportant()"
                >
                    <i-material-symbols-star-rounded v-if="important" class="h-6 w-6 text-[--primary-500]" />
                    <i-material-symbols-star-outline-rounded v-else class="h-6 w-6 text-[--primary-500]" />
                    <span class="ml-1">{{ important ? $t('task.important') : $t('task.notImportant') }}</span>
                </TextButton>

                <div v-if="editing" class="mt-4 flex flex-row-reverse gap-1.5 self-end text-sm">
                    <TextButton submit>
                        {{ $t('ui.save') }}
                    </TextButton>
                    <TextButton color="secondary" @click="editing = false">
                        {{ $t('ui.cancel') }}
                    </TextButton>
                </div>
                <div class="flex-1" />
                <div class="flex items-center justify-between">
                    <IconButton :aria-label="$t('ui.close')" :title="$t('ui.close')" @click="$workspaces.select(null)">
                        <i-zondicons-cheveron-right class="h-5 w-5" />
                    </IconButton>
                    <span class="self-center text-sm text-gray-500">
                        {{
                            $t('task.created', {
                                date: renderedCreatedAt,
                            })
                        }}
                    </span>
                    <IconButton
                        class="text-gray-500"
                        :aria-label="$t('ui.delete')"
                        :title="$t('ui.delete')"
                        @click="deleteTask()"
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
import {
    Colors,
    UI,
    booleanInput,
    dateInput,
    requiredStringInput,
    stringInput,
    translate,
    useForm,
} from '@aerogel/core';
import { computedModel } from '@aerogel/plugin-soukai';
import { computed, ref } from 'vue';
import type { ElementSize } from '@aerogel/core';

import Workspaces from '@/services/Workspaces';

const rootSize = ref<ElementSize>();
const form = useForm({
    name: requiredStringInput(''),
    description: stringInput(''),
    dueDate: dateInput(),
    important: booleanInput(),
});
const editing = ref(false);
const task = computedModel(() => Workspaces.task);
const important = computed(() => (editing.value ? form.important : task.value?.important));
const renderedCreatedAt = computed(() =>
    task.value?.createdAt.toLocaleDateString(undefined, {
        dateStyle: 'medium',
    }));
const renderedDueDate = computed(() =>
    task.value?.dueDate?.toLocaleDateString(undefined, {
        dateStyle: 'medium',
    }));

function startEditing(field: string) {
    if (!task.value) {
        return;
    }

    form.name = task.value.name;
    form.description = task.value.description ?? '';
    form.important = task.value.important ?? false;
    form.dueDate = task.value.dueDate ?? null;
    editing.value = true;

    form.focus(field);
}

async function toggleImportant() {
    if (!task.value) {
        return;
    }

    if (editing.value) {
        form.important = !form.important;

        return;
    }

    await task.value.update({ important: !task.value.important });
}

async function save() {
    if (!task.value || !editing.value) {
        return;
    }

    editing.value = false;

    await task.value.update({
        name: form.name.trim(),
        description: form.description?.trim() || null,
        dueDate: form.dueDate,
        important: form.important,
    });
}

async function deleteTask() {
    if (
        !task.value ||
        !(await UI.confirm(
            translate('task.delete.title'),
            translate('task.delete.message', { task: task.value.name }),
            {
                acceptText: translate('ui.delete'),
                acceptColor: Colors.Danger,
                cancelColor: Colors.Secondary,
            },
        ))
    ) {
        return;
    }

    await task.value.delete();
}
</script>
