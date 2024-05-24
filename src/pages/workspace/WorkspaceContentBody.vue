<template>
    <div class="px-4 py-6" @click="hideActiveTask($event)">
        <TaskForm @submit="createTask" />

        <TasksList :tasks="tasks.pending ?? []" class="mt-4" />

        <div v-if="tasks.completed?.length" class="mt-4">
            <AGButton @click="showCompleted = !showCompleted">
                {{ showCompleted ? $t('tasks.hideCompleted') : $t('tasks.showCompleted') }}
            </AGButton>
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
import Workspaces from '@/services/Workspaces';

const showCompleted = ref(false);
const tasks = computedModels(Task, () =>
    arrayGroupBy(TasksLists.current?.tasks ?? [], (task) => (task.completed ? 'completed' : 'pending')));

function hideActiveTask(event: Event) {
    if (event.target instanceof HTMLElement && event.target.dataset.task) {
        return;
    }

    Workspaces.hideActiveTask();
}

async function createTask(name: string) {
    const tasksList = TasksLists.current;

    if (!tasksList) {
        return;
    }

    const task = await tasksList.relatedTasks.create({ name, status: Task.STATUS_POTENTIAL });

    await Cloud.syncIfOnline(task);
}
</script>
