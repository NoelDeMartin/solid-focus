<template>
    <AnimationsConfig class="flex flex-col px-4" :duration="allPendingCompleted ? 600 : 300">
        <TasksForm v-if="$tasksList.tasks?.length" ref="$tasksFormRef" @submit="createTask($event)" />

        <div class="relative flex grow flex-col">
            <TasksList
                class="transition-[margin] duration-500"
                :tasks="tasks.pending"
                :disable-editing="disableEditing"
                :class="tasks.pending.length ? 'mt-4' : 'mt-0'"
                @added="updateCompletedToggleLayout()"
                @removed="updateCompletedToggleLayout()"
            />

            <TasksStart v-if="!tasks.pending.length && !tasks.completed.length" @create="createTask($event)" />

            <AnimatedTransition
                layout-group="completed-toggle"
                leave-animation="freeze"
                enter-from-class="max-h-0 p-0!"
            >
                <TasksEmpty
                    v-if="allPendingCompleted && !$focus.showCompleted"
                    v-animate
                    :enter="{ opacity: 1, y: 0, transition: { delay: 100 } }"
                    :initial="{ opacity: 0, y: -30 }"
                    :leave="{ opacity: 0, y: -200, transition: { duration: 300 } }"
                />
            </AnimatedTransition>

            <div
                v-if="tasks.completed.length"
                class="mt-4 flex flex-col"
                :class="{
                    grow: !allPendingCompleted,
                    'has-[.completed-tasks-wrapper:not(.absolute)]:grow': allPendingCompleted,
                }"
            >
                <Button
                    ref="$completedToggleRef"
                    v-animate-layout
                    layout-group="completed-toggle"
                    variant="ghost"
                    class="mb-1 ml-1 self-start pr-2 pl-1 font-medium tracking-wider uppercase"
                    :aria-label="$focus.showCompleted ? $t('tasks.hideCompleted') : $t('tasks.showCompleted')"
                    @click="$focus.toggleCompleted()"
                >
                    <i-zondicons-cheveron-right
                        class="size-6 transition-transform"
                        :class="{
                            'rotate-90': $focus.showCompleted,
                            'duration-[600ms]': allPendingCompleted,
                            'duration-[300ms]': !allPendingCompleted,
                        }"
                    />
                    <span>{{ $t('tasks.completed') }}</span>
                </Button>
                <AnimatedTransition
                    layout-group="completed-toggle"
                    :enter-from-class="allPendingCompleted ? 'absolute bottom-0 h-0' : ''"
                    :leave-to-class="allPendingCompleted ? 'absolute bottom-0 h-0' : ''"
                    @enter="allPendingCompleted ? toggleCompletedTasks($event) : slideDown($event.firstElementChild)"
                    @leave="allPendingCompleted ? toggleCompletedTasks($event) : slideUp($event.firstElementChild)"
                >
                    <div v-if="$focus.showCompleted" class="completed-tasks-wrapper overflow-hidden">
                        <TasksList :tasks="tasks.completed" :disable-editing="disableEditing" class="mt-4" />
                    </div>
                </AnimatedTransition>
            </div>
        </div>
    </AnimationsConfig>
</template>

<script setup lang="ts">
import { arrayGroupBy, arraySorted, compare } from '@noeldemartin/utils';
import { computed, ref, useTemplateRef, watch } from 'vue';
import { computedModels } from '@aerogel/plugin-soukai';
import { isAnimatableElement } from 'vivant';
import { recordSnapshot } from '@vivantjs/core';
import { UI } from '@aerogel/core';

import Focus from '@/services/Focus';
import Task from '@/models/Task';
import Tasks from '@/services/Tasks';
import TasksLists from '@/services/TasksLists';
import { watchKeyboardShortcut } from '@/utils/composables';

import { slideDown, slideUp, toggleCompletedTasks } from '@/pages/workspace/animations';

const $tasksForm = useTemplateRef('$tasksFormRef');
const $completedToggle = useTemplateRef('$completedToggleRef');
const disableEditingWithKeyboard = ref(false);
const disableEditing = computed(() => UI.mobile || disableEditingWithKeyboard.value);
const groupedTasks = computedModels(Task, () =>
    arrayGroupBy(TasksLists.current?.tasks ?? [], (task) => (task.completed ? 'completed' : 'pending')));
const tasks = computed(() => ({
    pending: arraySorted(groupedTasks.value.pending ?? [], compareTasks),
    completed: arraySorted(groupedTasks.value.completed ?? [], compareTasks),
}));
const showPending = computed(() => !!tasks.value.pending.length);
const allPendingCompleted = computed(() => !tasks.value.pending.length && tasks.value.completed.length);

function compareTasks(a: Task, b: Task): number {
    const importantComparison = compare(b.important, a.important);
    const dueDateComparison = !a.dueDate || !b.dueDate ? compare(b.dueDate, a.dueDate) : compare(a.dueDate, b.dueDate);
    const dateComparison = a.completed
        ? compare(b.completedAt, a.completedAt)
        : compare(b.createdAt ?? new Date(), a.createdAt ?? new Date());

    return [importantComparison, dueDateComparison, dateComparison].find((result) => result !== 0) ?? 0;
}

async function createTask(name: string) {
    const tasksList = TasksLists.current;

    if (!tasksList) {
        return;
    }

    await tasksList.relatedTasks.create({ name });
}

function changeTask(delta: 1 | -1) {
    const tasksList = tasks.value.pending.concat(Focus.showCompleted ? tasks.value.completed : []);
    const select = (task?: Task) => task && Tasks.select(task);

    if (!Tasks.current) {
        select(delta > 0 ? tasksList[0] : tasksList.slice(-1)[0]);

        return;
    }

    for (let index = 0; index < tasksList.length; index++) {
        const task = tasksList[index] as Task;

        if (!Tasks.current.is(task)) {
            continue;
        }

        select(tasksList[index + delta]);

        return;
    }
}

function updateCompletedToggleLayout() {
    if (!$completedToggle.value) {
        return;
    }

    const animatableElements = Array.from($completedToggle.value.$el?.children ?? [])
        .filter(isAnimatableElement)
        .concat([$completedToggle.value.$el]);

    for (const animatableElement of animatableElements) {
        recordSnapshot(animatableElement);
    }
}

watch(
    () => showPending.value,
    (value) => (Focus.showCompleted &&= value),
);
watchKeyboardShortcut('Control', {
    start: () => (disableEditingWithKeyboard.value = true),
    end: () => (disableEditingWithKeyboard.value = false),
});
watchKeyboardShortcut('+', { prevent: true }, () => $tasksForm.value?.focus());
watchKeyboardShortcut('c', () => Focus.toggleCompleted());
watchKeyboardShortcut('ArrowUp', () => changeTask(-1));
watchKeyboardShortcut('ArrowDown', () => changeTask(1));
watchKeyboardShortcut('Escape', () => Tasks.select(null));
</script>
