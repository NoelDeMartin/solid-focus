<template>
    <li
        class="relative isolate flex items-center rounded-lg px-2.5 text-base"
        :class="{ 'line-through': task.completed }"
    >
        <button
            type="button"
            class="absolute inset-0 h-full w-full rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-[--primary-500]"
            :class="{
                'bg-[--primary-100]': $workspaces.task?.is(task),
                'hover:bg-gray-100': !$workspaces.task?.is(task),
            }"
            :aria-label="$t('tasks.selectA11y', { name: task.name })"
            :title="$t('tasks.selectTitle')"
            @click="$workspaces.task?.is(task) ? $workspaces.select(null) : $workspaces.select(task)"
        />
        <input
            type="checkbox"
            class="clickable-target z-10 mr-2 h-5 w-5 cursor-pointer rounded border-2 border-[--primary] text-[--primary-500] hover:bg-[--primary-100] checked:hover:text-[--primary-400] focus:ring-[--primary-500] focus-visible:ring-[--primary-500]"
            :checked="task.completed"
            :aria-label="task.completed ? $t('tasks.undo') : $t('tasks.complete')"
            :aria-describedby="ariaId"
            @change="task.toggle()"
        >
        <EditableContent
            class="overflow-y-auto truncate py-2.5 pr-1"
            content-class="whitespace-pre"
            :disabled="disableEditing"
            :text="task.name"
            @update="task.setAttribute('name', $event)"
            @save="task.save()"
        >
            <AGMarkdown :id="ariaId" :text="task.name" inline />
            <span v-if="task.important" class="sr-only">
                {{ $t('tasks.important') }}
            </span>
        </EditableContent>
        <i-material-symbols-star-rounded v-if="task.important" class="z-10 h-6 w-6 text-[--primary-500]" />
    </li>
</template>

<script setup lang="ts">
import { booleanProp, requiredObjectProp } from '@aerogel/core';
import { uuid } from '@noeldemartin/utils';

import type Task from '@/models/Task';

defineProps({
    task: requiredObjectProp<Task>(),
    disableEditing: booleanProp(),
});

const ariaId = `task-${uuid()}`;
</script>
