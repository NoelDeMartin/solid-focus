<template>
    <div class="flex-1">
        <aside
            ref="$panelRef"
            class="fixed top-1 right-0 bottom-0 z-10 hidden w-full overflow-x-hidden overflow-y-auto border-l border-gray-200 bg-white p-4 will-change-[translate] md:w-auto md:min-w-96 md:p-6 md:pb-2"
        >
            <Form
                v-if="task"
                :form="form"
                class="flex size-full flex-col"
                @submit="save()"
            >
                <Markdown
                    v-if="editing"
                    :text="task.name"
                    class="sr-only"
                    as="h2"
                />
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

                <div class="flex gap-1">
                    <Button
                        v-if="!editing && $ui.mobile"
                        size="icon"
                        variant="ghost"
                        class="mt-0.5 self-start"
                        :aria-label="$t('ui.close')"
                        :title="$t('ui.close')"
                        @click="$tasks.select(null)"
                    >
                        <i-zondicons-arrow-left class="size-4" />
                    </Button>
                    <h2 v-if="!editing" class="w-full pt-2 whitespace-pre-wrap md:max-w-[21rem] md:pt-0">
                        <Markdown :text="task.name" inline class="text-start text-lg font-semibold" />
                    </h2>
                    <Input
                        v-else
                        multiline
                        :aria-label="$t('task.name')"
                        name="name"
                        :placeholder="$t('task.namePlaceholder')"
                        class="w-full"
                        input-class="md:max-w-[21rem] text-lg font-semibold py-2 px-3"
                    />
                    <DropdownMenu v-if="!editing && $ui.mobile" align="end">
                        <Button
                            size="icon"
                            variant="ghost"
                            :title="$t('task.actions')"
                            :aria-label="$t('task.actions')"
                        >
                            <i-zondicons-dots-horizontal-triple class="size-5" />
                        </Button>
                        <template #options>
                            <DropdownMenuOptions>
                                <DropdownMenuOption @select="startEditing('name')">
                                    <i-zondicons-edit-pencil class="size-4" />
                                    <span>{{ $t('task.edit') }}</span>
                                </DropdownMenuOption>
                                <DropdownMenuOption @select="deleteTask()">
                                    <i-zondicons-trash class="size-4" />
                                    <span>{{ $t('task.delete.button') }}</span>
                                </DropdownMenuOption>
                            </DropdownMenuOptions>
                        </template>
                    </DropdownMenu>
                </div>

                <div class="group relative isolate mt-2 w-full">
                    <Button
                        v-if="!editing && !task.description"
                        variant="ghost"
                        :aria-label="$t('task.editDescription')"
                        :title="$t('task.editDescription')"
                        class="h-32 w-full items-start justify-start bg-gray-50 text-start whitespace-normal hover:bg-gray-100 md:max-w-80"
                        @click="startEditing('description')"
                    >
                        <Markdown lang-key="task.emptyDescription" class="text-sm text-gray-400" />
                    </Button>
                    <Markdown
                        v-else-if="!editing"
                        :text="task.description"
                        class="w-full justify-start px-2 text-start text-base whitespace-normal md:max-w-[21rem] md:px-0"
                    />
                    <TaskDescriptionInput
                        v-else
                        :aria-label="$t('task.description')"
                        :placeholder="$t('task.descriptionPlaceholder')"
                        name="description"
                        class="w-full"
                        input-class="md:max-w-[21rem] py-2 px-3 min-h-32"
                    />
                    <Button
                        v-if="!editing && task.description"
                        size="icon"
                        variant="ghost"
                        class="clickable-target absolute top-0 right-0 z-10 hidden size-9 translate-x-14 -translate-y-full rounded-md bg-white p-0 transition-transform group-hover:translate-x-0 hover:bg-gray-200 md:flex"
                        :aria-label="$t('task.edit')"
                        :title="$t('task.edit')"
                        @click="startEditing('description')"
                    >
                        <i-zondicons-edit-pencil class="size-4" />
                    </Button>
                </div>

                <Button
                    v-if="!editing"
                    variant="ghost"
                    class="mt-2 self-start"
                    :title="$t('task.editDueDate')"
                    :aria-label="$t('task.editDueDate')"
                    @click="startEditing('dueDate')"
                >
                    <i-material-symbols-calendar-clock-rounded class="size-6 text-gray-500" />
                    <span class="ml-1.5">
                        {{ renderedDueDate ? $t('task.due', { date: renderedDueDate }) : $t('task.notDue') }}
                    </span>
                </Button>
                <Input
                    v-else
                    :aria-label="$t('task.dueDate')"
                    type="date"
                    name="dueDate"
                    class="mt-2"
                />

                <Button
                    variant="ghost"
                    class="mt-2 self-start"
                    :title="task.important ? $t('task.removeImportant') : $t('task.makeImportant')"
                    :aria-label="task.important ? $t('task.removeImportant') : $t('task.makeImportant')"
                    @click="toggleImportant()"
                >
                    <i-material-symbols-star-rounded v-if="important" class="text-primary-500 size-6" />
                    <i-material-symbols-star-outline-rounded v-else class="text-primary-500 size-6" />
                    <span class="ml-1.5">{{ important ? $t('task.important') : $t('task.notImportant') }}</span>
                </Button>

                <Button
                    variant="ghost"
                    :title="renderedCompletedAt ? $t('task.removeCompleted.button') : $t('task.complete')"
                    :aria-label="renderedCompletedAt ? $t('task.removeCompleted.button') : $t('task.complete')"
                    class="mt-2 self-start"
                    @click="toggleCompleted()"
                >
                    <i-app-checkmark v-if="renderedCompletedAt" class="text-primary-500 h-5 w-6 px-0.5" />
                    <i-app-checkmark-outline v-else class="text-primary-500 h-5 w-6 px-0.5" />
                    <span class="ml-1.5">
                        {{
                            renderedCompletedAt
                                ? $t('task.completed', {
                                    date: renderedCompletedAt,
                                })
                                : $t('task.notCompleted')
                        }}
                    </span>
                </Button>

                <div v-if="editing" class="mt-4 flex flex-row-reverse gap-1.5 self-end text-sm">
                    <Button submit>
                        {{ $t('ui.save') }}
                    </Button>
                    <Button variant="secondary" @click="editing = false">
                        {{ $t('ui.cancel') }}
                    </Button>
                </div>
                <div class="flex-1" />
                <div class="flex items-center justify-between">
                    <Button
                        size="icon"
                        variant="ghost"
                        :aria-label="$t('ui.close')"
                        :title="$t('ui.close')"
                        class="hidden md:block"
                        @click="$tasks.select(null)"
                    >
                        <i-zondicons-cheveron-right class="size-5" />
                    </Button>
                    <span
                        class="w-full text-center text-sm text-gray-500"
                        @click="tapCreatedAt()"
                        @touchdown="tapCreatedAt()"
                    >
                        {{
                            $t('task.created', {
                                date: renderedCreatedAt,
                            })
                        }}
                    </span>
                    <Button
                        size="icon"
                        variant="ghost"
                        class="hidden text-gray-500 md:block"
                        :aria-label="$t('ui.delete')"
                        :title="$t('ui.delete')"
                        @click="deleteTask()"
                    >
                        <i-zondicons-trash class="size-5" />
                    </Button>
                </div>
            </Form>
        </aside>
        <div
            ref="$fillerRef"
            v-measure.watch="(size: ElementSize) => $ui.desktop && ($focus.footerRightPadding = size.width)"
            class="hidden md:block"
        />
    </div>
</template>

<script setup lang="ts">
import { UI, booleanInput, dateInput, requiredStringInput, stringInput, translate, useForm } from '@aerogel/core';
import { computedModel, useModelEvent } from '@aerogel/plugin-soukai';
import { computed, onUnmounted, ref, useTemplateRef, watch, watchEffect } from 'vue';
import { Cloud } from '@aerogel/plugin-local-first';
import type { ElementSize } from '@aerogel/core';

import Focus from '@/services/Focus';
import Task from '@/models/Task';
import Tasks from '@/services/Tasks';
import { useWindowEvent } from '@/utils/composables';

import PanelAnimator from '@/pages/workspace/animations/PanelAnimator';

const $panel = useTemplateRef('$panelRef');
const $filler = useTemplateRef('$fillerRef');
const panelAnimator = new PanelAnimator($panel, $filler, 'right');
const createdAtTappedCount = ref(0);
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

    await task.value.update({ priority: task.value.important ? null : 1 });
}

async function toggleCompleted() {
    if (!task.value) {
        return;
    }

    const confirm =
        !task.value.completed ||
        (await UI.confirm(
            translate('task.removeCompleted.title'),
            translate('task.removeCompleted.message', { task: task.value.name }),
            { acceptText: translate('task.removeCompleted.accept') },
        ));

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
        name: form.name,
        description: form.description || null,
        dueDate: form.dueDate,
        priority: form.important ? 1 : null,
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
                acceptVariant: 'danger',
                cancelVariant: 'secondary',
            },
        ))
    ) {
        return;
    }

    if (Cloud.ready) {
        await task.value.softDelete();

        return;
    }

    await task.value.delete();
}

function tapCreatedAt() {
    if (createdAtTappedCount.value > 5) {
        UI.alert('Secret unlocked!', `\`${task.value?.url}\``);

        return;
    }

    createdAtTappedCount.value++;

    setTimeout(() => createdAtTappedCount.value--, 5000);
}

useModelEvent(Task, 'updated', async (updatedTask) => {
    if (updatedTask.url !== workspaceTask.value?.url || !updatedTask.isSoftDeleted()) {
        return;
    }

    await panelAnimator.hide();

    workspaceTask.value = undefined;
});

useWindowEvent('popstate', (event) => {
    if (!event.state?.hideTask) {
        return;
    }

    window.history.back();
    Tasks.select(null);
});

watch(task, () => (editing.value = false));

watchEffect(async () => {
    if (Tasks.current && !Tasks.current.isSoftDeleted()) {
        workspaceTask.value = Tasks.current;

        await panelAnimator.show();

        UI.mobile && window.history.pushState({ hideTask: true }, '', null);
        UI.mobile && window.history.pushState({}, '', null);

        return;
    }

    await panelAnimator.hide();

    workspaceTask.value = undefined;
});

onUnmounted(() => (Focus.footerRightPadding = null));
</script>
