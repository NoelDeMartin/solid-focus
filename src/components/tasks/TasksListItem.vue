<template>
    <li
        class="flex h-10 items-center rounded-lg"
        :class="{
            'line-through': task.completed,
            'bg-[--primary-100]': $workspaces.activeTask?.url === task.url,
        }"
    >
        <AGCheckbox
            class="ml-2 rounded border-[var(--primary)]"
            :checked="task.completed"
            :aria-label="task.completed ? $t('tasks.undo') : $t('tasks.complete')"
            :aria-describedby="ariaId"
            @update:model-value="task.toggle()"
        />
        <span :id="ariaId" data-task="true" @click="$workspaces.showTask(task)">{{ task.name }}</span>
    </li>
</template>

<script setup lang="ts">
import { requiredObjectProp } from '@aerogel/core';
import { uuid } from '@noeldemartin/utils';

import type Task from '@/models/Task';

const ariaId = `task-${uuid()}`;

defineProps({ task: requiredObjectProp<Task>() });
</script>
