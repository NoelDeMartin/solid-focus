<template>
    <div class="flex-1">
        <aside
            ref="$panel"
            class="fixed bottom-0 right-0 top-1 z-10 hidden w-screen border-l bg-white p-4 will-change-transform md:w-auto md:min-w-96 md:p-6 md:pb-2"
        >
            <AGForm
                v-if="task"
                :form="form"
                class="flex h-full w-full flex-col"
                @submit="save()"
            >
                <AGMarkdown :text="task.name" class="sr-only" as="h2" />
                <span class="sr-only">
                    {{ task.important ? $t('task.importantA11y') : $t('task.notImportantA11y') }}
                </span>
                <span class="sr-only">
                    {{
                        renderedCompletedAt
                            ? $t('task.completed', {
                                date: renderedCompletedAt,
                            })
                            : $t('task.pendingA11y')
                    }}
                </span>
                <AGMarkdown v-if="task.description" :text="task.description" class="sr-only" />

                <div class="flex gap-1">
                    <IconButton
                        v-if="!editing && $ui.mobile"
                        class="mt-0.5 self-start"
                        :aria-label="$t('ui.close')"
                        :title="$t('ui.close')"
                        @click="$workspaces.select(null)"
                    >
                        <i-zondicons-arrow-left class="h-4 w-4" />
                    </IconButton>
                    <TextButton
                        v-if="!editing"
                        color="clear"
                        class="w-full justify-start whitespace-pre-wrap text-start md:max-w-80"
                        :aria-label="$t('task.editName')"
                        :title="$t('task.editName')"
                        @click="startEditing('name')"
                    >
                        <AGMarkdown :text="task.name" inline class="text-lg font-semibold" />
                    </TextButton>
                    <TextInput
                        v-else
                        multiline
                        :aria-label="$t('task.name')"
                        name="name"
                        class="w-full"
                        input-class="md:max-w-80 text-lg font-semibold py-2 px-3"
                    />

                    <OptionsMenu v-if="!editing && $ui.mobile">
                        <IconButton :as="MenuButton" :title="$t('task.actions')" :aria-label="$t('task.actions')">
                            <i-zondicons-dots-horizontal-triple class="h-5 w-5" />
                        </IconButton>

                        <template #options>
                            <OptionsMenuItems>
                                <OptionsMenuItem @click="startEditing('name')">
                                    <i-zondicons-edit-pencil class="h-4 w-4" />
                                    <span class="ml-3">{{ $t('task.edit') }}</span>
                                </OptionsMenuItem>
                                <OptionsMenuItem @click="deleteTask()">
                                    <i-zondicons-trash class="h-4 w-4" />
                                    <span class="ml-3">{{ $t('task.delete.button') }}</span>
                                </OptionsMenuItem>
                            </OptionsMenuItems>
                        </template>
                    </OptionsMenu>
                </div>

                <div class="mt-2 w-full">
                    <TextButton
                        v-if="!editing"
                        color="clear"
                        :aria-label="$t('task.editDescription')"
                        :title="$t('task.editDescription')"
                        class="min-h-12 w-full justify-start whitespace-normal text-start md:max-w-80"
                        :class="{ 'bg-gray-50': !task.description }"
                        @click="startEditing('description')"
                    >
                        <AGMarkdown v-if="task.description" :text="task.description" class="text-base" />
                        <AGMarkdown v-else lang-key="task.emptyDescription" class="text-sm text-gray-400" />
                    </TextButton>
                    <TaskDescriptionInput
                        v-else
                        :aria-label="$t('task.description')"
                        name="description"
                        class="w-full"
                        input-class="md:max-w-80 py-2 px-3"
                    />
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
                <DateInput
                    v-else
                    :aria-label="$t('task.dueDate')"
                    name="dueDate"
                    class="mt-2"
                />

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

                <TextButton
                    v-if="renderedCompletedAt"
                    color="clear"
                    :title="$t('task.removeCompleted.button')"
                    :aria-label="$t('task.removeCompleted.button')"
                    class="mt-2 self-start"
                    @click="removeCompleted()"
                >
                    <i-zondicons-checkmark class="h-5 w-5 text-[--primary-500]" />
                    <span class="ml-1">
                        {{
                            $t('task.completed', {
                                date: renderedCompletedAt,
                            })
                        }}
                    </span>
                </TextButton>

                <TextButton
                    v-else
                    color="secondary"
                    class="mt-2"
                    @click="task.toggle()"
                >
                    <span>{{ $t('task.complete') }}</span>
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
                    <IconButton
                        :aria-label="$t('ui.close')"
                        :title="$t('ui.close')"
                        class="hidden md:block"
                        @click="$workspaces.select(null)"
                    >
                        <i-zondicons-cheveron-right class="h-5 w-5" />
                    </IconButton>
                    <span class="w-full text-center text-sm text-gray-500">
                        {{
                            $t('task.created', {
                                date: renderedCreatedAt,
                            })
                        }}
                    </span>
                    <IconButton
                        class="hidden text-gray-500 md:block"
                        :aria-label="$t('ui.delete')"
                        :title="$t('ui.delete')"
                        @click="deleteTask()"
                    >
                        <i-zondicons-trash class="h-5 w-5" />
                    </IconButton>
                </div>
            </AGForm>
        </aside>
        <div
            ref="$filler"
            v-measure.watch="(size: ElementSize) => $ui.desktop && ($focus.footerRightPadding = size.width)"
            class="hidden md:block"
        />
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
import { computedModel, useModelEvent } from '@aerogel/plugin-soukai';
import { computed, onUnmounted, ref, watchEffect } from 'vue';
import { Cloud } from '@aerogel/plugin-offline-first';
import { MenuButton } from '@headlessui/vue';
import type { ElementSize } from '@aerogel/core';

import Focus from '@/services/Focus';
import Task from '@/models/Task';
import Workspaces from '@/services/Workspaces';

import { PanelAnimator } from './animations';

const $panel = ref<HTMLElement>();
const $filler = ref<HTMLElement>();
const panelAnimator = new PanelAnimator($panel, $filler, 'right');
const form = useForm({
    name: requiredStringInput(''),
    description: stringInput(''),
    dueDate: dateInput(),
    important: booleanInput(),
});
const editing = ref(false);
const workspaceTask = ref<Task>();
const task = computedModel(() => workspaceTask.value);
const important = computed(() => (editing.value ? form.important : task.value?.important));
const renderedCreatedAt = computed(() =>
    task.value?.createdAt.toLocaleDateString(undefined, {
        dateStyle: 'medium',
    }));
const renderedCompletedAt = computed(() =>
    task.value?.completedAt?.toLocaleDateString(undefined, {
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

async function removeCompleted() {
    if (!task.value) {
        return;
    }

    const confirm = await UI.confirm(
        translate('task.removeCompleted.title'),
        translate('task.removeCompleted.message', { task: task.value.name }),
        { acceptText: translate('task.removeCompleted.accept') },
    );

    if (!confirm) {
        return;
    }

    await task.value.toggle();
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

    if (Cloud.ready) {
        await task.value.softDelete();
        await Cloud.syncIfOnline(task.value);

        return;
    }

    await task.value.delete();
}

useModelEvent(Task, 'updated', async (updatedTask) => {
    if (updatedTask.url !== workspaceTask.value?.url || !updatedTask.isSoftDeleted()) {
        return;
    }

    await panelAnimator.hide();

    workspaceTask.value = undefined;
});

watchEffect(async () => {
    if (Workspaces.task && !Workspaces.task.isSoftDeleted()) {
        workspaceTask.value = Workspaces.task;

        await panelAnimator.show();

        return;
    }

    await panelAnimator.hide();

    workspaceTask.value = undefined;
});

onUnmounted(() => (Focus.footerRightPadding = null));
</script>
