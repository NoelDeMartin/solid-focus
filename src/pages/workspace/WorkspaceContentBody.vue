<template>
    <div class="px-4">
        <TaskCreateForm @submit="createTask" />
        <TasksList :tasks="tasks.pending" :disable-editing="disableEditing" class="mt-4" />
        <div v-if="tasks.completed.length" class="mt-4">
            <TextButton
                color="clear"
                class="ml-1 rounded-lg pl-1 pr-2 font-medium uppercase tracking-wider"
                :aria-label="showCompleted ? $t('tasks.hideCompleted') : $t('tasks.showCompleted')"
                @click="showCompleted = !showCompleted"
            >
                <i-zondicons-cheveron-right
                    class="h-6 w-6 transition-transform"
                    :class="{ 'rotate-90': showCompleted }"
                />
                <span>{{ $t('tasks.completed') }}</span>
            </TextButton>
            <TasksList
                v-if="showCompleted"
                :tasks="tasks.completed"
                :disable-editing="disableEditing"
                class="mt-4"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import { arrayGroupBy, compare } from '@noeldemartin/utils';
import { Cloud } from '@aerogel/plugin-offline-first';
import { computed, ref } from 'vue';
import { computedModels } from '@aerogel/plugin-soukai';

import Task from '@/models/Task';
import TasksLists from '@/services/TasksLists';
import Workspaces from '@/services/Workspaces';
import { watchKeyboardShortcut } from '@/utils/composables';

const showCompleted = ref(false);
const disableEditing = ref(false);
const groupedTasks = computedModels(Task, () =>
    arrayGroupBy(TasksLists.current?.tasks ?? [], (task) => (task.completed ? 'completed' : 'pending')));
const tasks = computed(() => ({
    pending: groupedTasks.value.pending?.toSorted(compareTasks) ?? [],
    completed: groupedTasks.value.completed?.toSorted(compareTasks) ?? [],
}));

function compareTasks(a: Task, b: Task): number {
    const importantComparison = compare(b.important, a.important);
    const dueDateComparison = !a.dueDate || !b.dueDate ? compare(b.dueDate, a.dueDate) : compare(a.dueDate, b.dueDate);
    const dateComparison = a.completed ? compare(b.completedAt, a.completedAt) : compare(a.createdAt, b.createdAt);

    return [importantComparison, dueDateComparison, dateComparison].find((result) => result !== 0) ?? 0;
}

async function createTask(name: string) {
    const tasksList = TasksLists.current;

    if (!tasksList) {
        return;
    }

    const task = await tasksList.relatedTasks.create({ name, status: Task.STATUS_POTENTIAL });

    await Cloud.syncIfOnline(task);
}

function changeTask(delta: 1 | -1) {
    const tasksList = tasks.value.pending.concat(showCompleted.value ? tasks.value.completed : []);
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

watchKeyboardShortcut('Control', {
    start: () => (disableEditing.value = true),
    end: () => (disableEditing.value = false),
});
watchKeyboardShortcut('ArrowUp', () => changeTask(-1));
watchKeyboardShortcut('ArrowDown', () => changeTask(1));
watchKeyboardShortcut('Escape', () => Workspaces.select(null));
</script>
