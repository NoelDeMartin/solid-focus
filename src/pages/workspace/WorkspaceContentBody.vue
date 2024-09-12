<template>
    <AnimatedGroup ref="$group" class="flex flex-col px-4" :duration="allPendingCompleted ? 500 : 300">
        <TasksForm v-if="$tasksList.tasks?.length" ref="$tasksForm" @submit="createTask($event)" />

        <div class="relative flex flex-grow flex-col">
            <TasksList
                class="transition-[margin] duration-500"
                :tasks="tasks.pending"
                :disable-editing="disableEditing"
                :class="tasks.pending.length ? 'mt-4' : 'mt-0'"
            />

            <TasksStart v-if="!tasks.pending.length && !tasks.completed.length" @create="createTask($event)" />

            <AnimatedTransition
                enter-active-class="transition-[opacity,transform] delay-200 duration-500"
                enter-from-class="max-h-0 !py-0 opacity-0 -translate-y-12"
                enter-to-class="opacity-100 translate-y-0"
                leave-active-class="transition-[opacity,transform] duration-500"
                leave-from-class="opacity-100 translate-y-0"
                leave-to-class="absolute top-0 opacity-0 -translate-y-52"
                leave-animation="freeze"
            >
                <TasksEmpty v-if="allPendingCompleted && !$focus.showCompleted" />
            </AnimatedTransition>

            <div
                v-if="tasks.completed.length"
                class="flex flex-col"
                :class="{
                    'mt-4 flex-grow': !allPendingCompleted,
                    'has-[.completed-tasks-wrapper:not(.absolute)]:mt-4': allPendingCompleted,
                    'has-[.completed-tasks-wrapper:not(.absolute)]:flex-grow': allPendingCompleted,
                }"
            >
                <TextButton
                    v-animate-layout
                    color="clear"
                    class="ml-1 self-start pl-1 pr-2 font-medium uppercase tracking-wider"
                    :aria-label="$focus.showCompleted ? $t('tasks.hideCompleted') : $t('tasks.showCompleted')"
                    @click="$focus.toggleCompleted()"
                >
                    <i-zondicons-cheveron-right
                        class="h-6 w-6 transition-transform"
                        :class="{ 'rotate-90': $focus.showCompleted }"
                    />
                    <span>{{ $t('tasks.completed') }}</span>
                </TextButton>
                <AnimatedTransition
                    :enter-from-class="`${allPendingCompleted ? 'absolute bottom-0' : ''} h-0`"
                    :leave-to-class="`${allPendingCompleted ? 'absolute bottom-0' : ''} h-0`"
                    @enter="allPendingCompleted ? toggleCompletedTasks($event) : slideDown($event.firstElementChild)"
                    @leave="
                        allPendingCompleted
                            ? toggleCompletedTasks($event)
                            : ($event.classList.remove('h-0'), slideUp($event.firstElementChild))
                    "
                >
                    <div v-if="$focus.showCompleted" class="completed-tasks-wrapper overflow-hidden">
                        <TasksList :tasks="tasks.completed" :disable-editing="disableEditing" class="mt-4" />
                    </div>
                </AnimatedTransition>
            </div>
        </div>
    </AnimatedGroup>
</template>

<script setup lang="ts">
import { arrayGroupBy, arraySorted, compare } from '@noeldemartin/utils';
import { Cloud } from '@aerogel/plugin-offline-first';
import { computed, onUnmounted, ref, watch, watchEffect } from 'vue';
import { computedModels } from '@aerogel/plugin-soukai';
import { slideDown, slideUp } from '@/vivant/core';
import { UI } from '@aerogel/core';
import type { IAnimatedGroup } from '@/vivant/vue';

import Focus from '@/services/Focus';
import Task from '@/models/Task';
import TasksLists from '@/services/TasksLists';
import Workspaces from '@/services/Workspaces';
import { watchKeyboardShortcut } from '@/utils/composables';

import { toggleCompletedTasks, toggleFooter } from './animations/tasks';
import type { ITasksForm } from './components/tasks/TasksForm';

const $group = ref<IAnimatedGroup>();
const $tasksForm = ref<ITasksForm>();
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
    const dateComparison = a.completed ? compare(b.completedAt, a.completedAt) : compare(b.createdAt, a.createdAt);

    return [importantComparison, dueDateComparison, dateComparison].find((result) => result !== 0) ?? 0;
}

async function createTask(name: string) {
    const tasksList = TasksLists.current;

    if (!tasksList) {
        return;
    }

    await tasksList.relatedTasks.create({ name, status: Task.STATUS_POTENTIAL });
}

function changeTask(delta: 1 | -1) {
    const tasksList = tasks.value.pending.concat(Focus.showCompleted ? tasks.value.completed : []);
    const select = (task?: Task) => task && Workspaces.select(task);

    if (!Workspaces.task) {
        select(delta > 0 ? tasksList[0] : tasksList.slice(-1)[0]);

        return;
    }

    for (let index = 0; index < tasksList.length; index++) {
        const task = tasksList[index] as Task;

        if (!Workspaces.task.is(task)) {
            continue;
        }

        select(tasksList[index + delta]);

        return;
    }
}

watch(
    () => showPending.value,
    (value) => (Focus.showCompleted &&= value),
);
watchEffect(
    () =>
        $group.value &&
        Focus.setFooterAnimation({
            group: $group.value.group,
            animate: toggleFooter,
        }),
);
watchKeyboardShortcut('Control', {
    start: () => (disableEditingWithKeyboard.value = true),
    end: () => (disableEditingWithKeyboard.value = false),
});
watchKeyboardShortcut('+', () => $tasksForm.value?.focus());
watchKeyboardShortcut('c', () => Focus.toggleCompleted());
watchKeyboardShortcut('ArrowUp', () => changeTask(-1));
watchKeyboardShortcut('ArrowDown', () => changeTask(1));
watchKeyboardShortcut('Escape', () => Workspaces.select(null));

onUnmounted(() => Focus.setFooterAnimation(null));
</script>
