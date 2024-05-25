<template>
    <div class="px-4">
        <TaskForm @submit="createTask" />
        <TasksList :tasks="tasks.pending ?? []" class="mt-4" />

        <div v-if="tasks.completed?.length" class="mt-4">
            <button
                type="button"
                class="ml-1 flex items-center justify-center rounded-xl py-2 pl-1 pr-2 font-medium uppercase tracking-wider hover:bg-gray-100 focus-visible:outline focus-visible:outline-gray-700"
                :aria-label="showCompleted ? $t('tasks.hideCompleted') : $t('tasks.showCompleted')"
                @click="showCompleted = !showCompleted"
            >
                <i-zondicons-cheveron-right
                    class="h-6 w-6 transition-transform"
                    :class="{ 'rotate-90': showCompleted }"
                />
                <span>{{ $t('tasks.completed') }}</span>
            </button>
            <TasksList v-if="showCompleted" :tasks="tasks.completed" class="mt-4" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { arrayGroupBy } from '@noeldemartin/utils';
import { Cloud } from '@aerogel/plugin-offline-first';
import { computedModels } from '@aerogel/plugin-soukai';
import { ref } from 'vue';

import Task from '@/models/Task';
import TasksLists from '@/services/TasksLists';

const showCompleted = ref(false);
const tasks = computedModels(Task, () =>
    arrayGroupBy(TasksLists.current?.tasks ?? [], (task) => (task.completed ? 'completed' : 'pending')));

async function createTask(name: string) {
    const tasksList = TasksLists.current;

    if (!tasksList) {
        return;
    }

    const task = await tasksList.relatedTasks.create({ name, status: Task.STATUS_POTENTIAL });

    await Cloud.syncIfOnline(task);
}
</script>
