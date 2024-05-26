<template>
    <Story group="tasks" :layout="{ type: 'grid' }">
        <Variant title="Playground">
            <TasksListItem :task="task" />

            <template #controls>
                <HstText v-model="name" title="Name" />
                <HstSelect v-model="color" title="Color" :options="colorOptions" />
            </template>
        </Variant>

        <Variant title="Pending">
            <TasksListItem :task="pendingTask" />
        </Variant>

        <Variant title="Completed">
            <TasksListItem :task="completedTask" class=":hover" />
        </Variant>

        <Variant title="Selected">
            <TasksListItem :task="selectedTask" />
        </Variant>
    </Story>
</template>

<script setup lang="ts">
import { computed, ref, watchEffect } from 'vue';

import Task from '@/models/Task';
import Workspaces from '@/services/Workspaces';
import { useWorkspaceColor } from '@/utils/histoire';

const [color, colorOptions] = useWorkspaceColor();
const name = ref('You should **definitely** watch *Love Exposure*');
const task = computed(() => new Task({ url: 'default', name: name.value, status: Task.STATUS_POTENTIAL }));
const pendingTask = computed(() => new Task({ url: 'pending', name: name.value, status: Task.STATUS_POTENTIAL }));
const selectedTask = computed(() => new Task({ url: 'selected', name: name.value, status: Task.STATUS_POTENTIAL }));
const completedTask = computed(
    () => new Task({ url: 'completed', name: name.value, status: Task.STATUS_COMPLETED, completedAt: new Date() }),
);

watchEffect(() => Workspaces.select(selectedTask.value));
</script>

<style>
.story-taskslistitem {
    grid-template-columns: 750px !important;
}
</style>
