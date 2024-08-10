<template>
    <li class="pt-0.5">
        <div class="relative isolate rounded-lg px-2.5 text-base" :class="{ 'text-gray-500': task.completed }">
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
            <div class="pointer-events-none relative flex items-center [&>*]:pointer-events-auto">
                <input
                    type="checkbox"
                    class="clickable-target mr-2 h-5 w-5 cursor-pointer rounded border-2 border-[--primary] text-[--primary-500] hover:bg-[--primary-100] checked:hover:text-[--primary-400] focus:ring-[--primary-500] focus-visible:ring-[--primary-500]"
                    :checked="task.completed"
                    :aria-labelledby="ariaId"
                    @change="task.toggle()"
                >
                <i-material-symbols-star-rounded
                    v-if="task.important"
                    class="!pointer-events-none h-6 w-6 text-[--primary-500]"
                />
                <EditableContent
                    class="overflow-y-auto truncate py-2.5 pr-1"
                    content-class="whitespace-pre"
                    tabindex="-1"
                    form-aria-hidden
                    :class="{ 'line-through': task.completed }"
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
                <i-material-symbols-description-rounded
                    v-if="task.description"
                    class="!pointer-events-none h-5 w-5 text-gray-400"
                />
                <div class="flex-1" />
                <span
                    v-if="renderedDueDate"
                    class="!pointer-events-none"
                    :class="{ 'text-red-600': isPast && !task.completed }"
                >
                    {{ renderedDueDate }}
                </span>
            </div>
        </div>
    </li>
</template>

<script setup lang="ts">
import { booleanProp, requiredObjectProp, translate } from '@aerogel/core';
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

const props = defineProps({
    task: requiredObjectProp<Task>(),
    disableEditing: booleanProp(),
});
const ariaId = `task-${uuid()}`;
const isPast = computed(() => props.task.dueDate && getDaysDiff(props.task.dueDate, TODAY) < 0);
const renderedDueDate = computed(() => {
    const dueDate = props.task.dueDate;

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
