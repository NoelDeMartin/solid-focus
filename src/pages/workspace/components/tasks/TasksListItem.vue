<template>
    <li class="pt-0.5">
        <div class="relative isolate rounded-lg px-2.5 text-base" :class="{ 'text-gray-500': task.completed }">
            <button
                type="button"
                class="focus-visible:outline-primary-500 absolute inset-0 size-full rounded-lg focus-visible:outline-2"
                :class="{
                    'bg-primary-100': $tasks.current?.is(task),
                    'hover:bg-gray-100': !$tasks.current?.is(task),
                }"
                :aria-label="$t('tasks.selectA11y', { name: task.name })"
                :title="$t('tasks.selectTitle')"
                @click="$tasks.current?.is(task) ? $tasks.select(null) : $tasks.select(task)"
            />
            <div class="pointer-events-none relative flex items-center *:pointer-events-auto">
                <input
                    type="checkbox"
                    class="clickable-target text-primary-500 focus:ring-primary-500 focus-visible:ring-primary-500 not-checked:hover:bg-primary-100 checked:hover:text-primary-400 border-primary-500 mr-2 size-5 rounded-sm border-2"
                    :checked="task.completed"
                    :aria-labelledby="ariaId"
                    @change="task.toggle()"
                >
                <i-material-symbols-star-rounded
                    v-if="task.important"
                    class="text-primary-500 pointer-events-none! size-6 shrink-0"
                />
                <EditableContent
                    class="truncate overflow-y-auto py-2.5 pr-1"
                    content-class="whitespace-pre"
                    tabindex="-1"
                    form-aria-hidden
                    :class="{ 'line-through': task.completed }"
                    :disabled="disableEditing"
                    :text="task.name"
                    @update="task.setAttribute('name', $event)"
                    @save="task.save()"
                >
                    <Markdown :id="ariaId" :text="task.name" inline />
                    <span v-if="task.important" class="sr-only">
                        {{ $t('tasks.important') }}
                    </span>
                </EditableContent>
                <i-material-symbols-description-rounded
                    v-if="task.description"
                    class="pointer-events-none! size-5 text-gray-400"
                />
                <div class="flex-1" />
                <span
                    v-if="renderedDueDate"
                    class="pointer-events-none!"
                    :class="{ 'text-red-600': isPast && !task.completed }"
                >
                    {{ renderedDueDate }}
                </span>
            </div>
        </div>
    </li>
</template>

<script setup lang="ts">
import { translate } from '@aerogel/core';
import { computed } from 'vue';
import { uuid } from '@noeldemartin/utils';

import { getDaysDiff } from '@/utils/time';
import type Task from '@/models/Task';

const TODAY = new Date();
const NAMED_DAYS_DIFF: Record<string, string> = {
    '-1': translate('time.yesterday'),
    '0': translate('time.today'),
    '1': translate('time.tomorrow'),
};

const { task, disableEditing } = defineProps<{ task: Task; disableEditing?: boolean }>();
const ariaId = `task-${uuid()}`;
const isPast = computed(() => task.dueDate && getDaysDiff(task.dueDate, TODAY) < 0);
const renderedDueDate = computed(() => {
    const dueDate = task.dueDate;

    if (!dueDate) {
        return;
    }

    const daysDiff = getDaysDiff(dueDate, TODAY);

    return (
        NAMED_DAYS_DIFF[daysDiff] ??
        dueDate.toLocaleDateString(undefined, {
            dateStyle: 'medium',
        })
    );
});
</script>
