<template>
    <div class="px-4 py-6">
        <AGForm
            v-initial-focus
            :form="form"
            class="flex"
            @submit="createTask()"
        >
            <AGInput name="draft" label="Task name" />
            <AGButton submit>
                {{ $t('tasks.add') }}
            </AGButton>
        </AGForm>
        <TasksList :tasks="$tasksList.tasks" class="mt-4" />
    </div>
</template>

<script setup lang="ts">
import Task from '@/models/Task';
import TasksLists from '@/services/TasksLists';
import { requiredStringInput, useForm } from '@aerogel/core';

const form = useForm({ draft: requiredStringInput() });

async function createTask() {
    const name = form.draft.trim();
    const tasksList = TasksLists.current;

    form.reset();

    if (!name || !tasksList) {
        return;
    }

    const task = await Task.create({ name });

    tasksList.relatedTasks.attach(task);

    await tasksList.save();
}
</script>
