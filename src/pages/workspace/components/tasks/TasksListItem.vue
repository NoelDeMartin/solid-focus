<template>
    <li
        class="relative isolate flex items-center gap-2 rounded-lg px-2.5 text-base"
        :class="{ 'line-through': task.completed }"
    >
        <button
            type="button"
            class="absolute inset-0 h-full w-full rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-[--primary-500]"
            :class="{
                'bg-[--primary-100]': $workspaces.activeTask?.is(task),
                'hover:bg-gray-100': !$workspaces.activeTask?.is(task),
            }"
            :aria-label="$t('tasks.selectA11y', { name: task.name })"
            :title="$t('tasks.selectTitle')"
            @click="$workspaces.activeTask?.is(task) ? $workspaces.hideActiveTask() : $workspaces.showTask(task)"
        />
        <input
            type="checkbox"
            class="clickable-target z-10 h-5 w-5 cursor-pointer rounded border-2 border-[--primary] text-[--primary-500] hover:bg-[--primary-100] checked:hover:text-[--primary-400] focus:ring-[--primary-500] focus-visible:ring-[--primary-500]"
            :checked="task.completed"
            :aria-label="task.completed ? $t('tasks.undo') : $t('tasks.complete')"
            :aria-describedby="ariaId"
            @change="task.toggle()"
        >
        <div
            class="relative z-10 overflow-y-auto truncate py-2.5 pr-2"
            :class="{ 'pointer-events-none': editing === false }"
        >
            <AGMarkdown
                v-if="!editing"
                :id="ariaId"
                :text="task.name"
                inline
                class="whitespace-pre"
            />
            <span v-else class="invisible whitespace-pre">
                {{ draft }}
            </span>
            <form @submit.prevent="$input?.blur()">
                <input
                    ref="$input"
                    v-model="draft"
                    type="text"
                    tabindex="-1"
                    class="absolute inset-0 h-full w-full border-0 bg-transparent p-0 focus:ring-0"
                    :class="{ 'opacity-0': !editing }"
                    @keyup="task.setAttribute('name', draft)"
                    @focus="startEditing()"
                    @blur="stopEditing()"
                >
            </form>
        </div>
    </li>
</template>

<script setup lang="ts">
import { ref, watchEffect } from 'vue';
import { requiredObjectProp } from '@aerogel/core';
import { uuid } from '@noeldemartin/utils';

import { watchKeyboardShortcut } from '@/utils/composables';
import type Task from '@/models/Task';

const props = defineProps({ task: requiredObjectProp<Task>() });
const $input = ref<HTMLElement>();
const ariaId = `task-${uuid()}`;
const editing = ref<string | false | null>(null);
const draft = ref(props.task.name);

function startEditing() {
    editing.value = props.task.name;
}

function stopEditing() {
    if (!editing.value) {
        return;
    }

    if (draft.value.trim().length === 0) {
        draft.value = editing.value;
        props.task.setAttribute('name', draft.value);
    }

    editing.value = null;

    props.task.save();
}

watchEffect(() => (draft.value = props.task.name));
watchKeyboardShortcut('Control', {
    start() {
        if (editing.value) {
            $input.value?.blur();
        }

        editing.value = false;
    },
    end() {
        if (editing.value !== false) {
            return;
        }

        editing.value = null;
    },
});
</script>
