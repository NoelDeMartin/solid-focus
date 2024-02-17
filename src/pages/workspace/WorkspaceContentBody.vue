<template>
    <div class="px-4 py-6">
        <AGForm
            v-initial-focus
            :form="form"
            class="flex"
            @submit="createTask()"
        >
            <AGInput name="draft" :label="$t('tasks.label')" />
            <AGButton submit>
                {{ $t('tasks.add') }}
            </AGButton>
        </AGForm>

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
import { Cloud } from '@aerogel/plugin-offline-first';
import { computedModels } from '@aerogel/plugin-soukai';
import { ref } from 'vue';
import { requiredStringInput, useForm } from '@aerogel/core';

import Task from '@/models/Task';
import TasksLists from '@/services/TasksLists';
import { arrayGroupBy } from '@noeldemartin/utils';

const form = useForm({ draft: requiredStringInput() });
const showCompleted = ref(false);
const tasks = computedModels(Task, () =>
    arrayGroupBy(TasksLists.current?.tasks ?? [], (task) => (task.isCompleted() ? 'completed' : 'pending')));

async function createTask() {
    const name = form.draft.trim();
    const tasksList = TasksLists.current;

    form.reset();

    if (!name || !tasksList) {
        return;
    }

    const task = await tasksList.relatedTasks.create({ name, status: Task.STATUS_POTENTIAL });

    await Cloud.syncIfOnline(task);
}
</script>
