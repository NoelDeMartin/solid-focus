<template>
    <Story group="tasks" :layout="{ type: 'grid' }">
        <Variant title="Playground">
            <TasksListItem :task="task" />

            <template #controls>
                <HstText v-model="name" title="Name" />
                <HstCheckbox v-model="description" title="Description" />
                <HstCheckbox v-model="important" title="Important" />
                <HstSelect v-model="dueDate" title="Due date" :options="dueDateOptions" />
                <HstSelect v-model="themeColor" title="Theme Color" :options="themeColorOptions" />
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
import { useThemeColor } from '@/utils/histoire';
import { invert } from '@noeldemartin/utils';

const DueDates = {
    None: 'none',
    Past: 'past',
    Yesterday: 'yesterday',
    Today: 'today',
    Tomorrow: 'tomorrow',
    Future: 'future',
} as const;

const DUE_DATES: Record<DueDate, Date | null> = {
    [DueDates.None]: null,
    [DueDates.Past]: new Date(Date.now() - 31 * 24 * 60 * 60 * 1000),
    [DueDates.Yesterday]: new Date(Date.now() - 24 * 60 * 60 * 1000),
    [DueDates.Today]: new Date(Date.now()),
    [DueDates.Tomorrow]: new Date(Date.now() + 24 * 60 * 60 * 1000),
    [DueDates.Future]: new Date(Date.now() + 31 * 24 * 60 * 60 * 1000),
};

type DueDate = (typeof DueDates)[keyof typeof DueDates];

const [themeColor, themeColorOptions] = useThemeColor();
const name = ref('You should **definitely** watch *Love Exposure*');
const description = ref(true);
const important = ref(true);
const dueDate = ref<DueDate>(DueDates.Today);
const dueDateOptions = invert(DueDates);
const task = computed(
    () =>
        new Task({
            url: 'default',
            name: name.value,
            description: description.value ? 'Something' : null,
            important: important.value,
            status: Task.STATUS_POTENTIAL,
            dueDate: DUE_DATES[dueDate.value],
        }),
);
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
    list-style: none;
}
</style>
