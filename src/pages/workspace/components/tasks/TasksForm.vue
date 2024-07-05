<template>
    <AGForm
        v-initial-focus
        class="group relative flex gap-2 rounded-lg md:gap-4"
        :class="{
            'bg-gray-100 focus-within:bg-transparent hover:bg-gray-200 focus-within:hover:bg-transparent': !form.draft,
        }"
        :form="form"
        @submit="submit()"
    >
        <AGHeadlessInput
            ref="$input"
            name="draft"
            :description="$ui.mobile ? $t('tasks.mobileInputDescription') : $t('tasks.desktopInputDescription')"
            class="relative flex-1"
        >
            <AGHeadlessInputInput
                class="absolute inset-0 h-full w-full rounded-lg border-gray-200 pl-3 pr-10 opacity-0 hover:bg-gray-50 focus:border-[--primary-500] focus:ring-[--primary-500] group-focus-within:opacity-100 md:pl-6"
                :aria-label="$t('tasks.inputLabel')"
                :class="[inputClass, { 'opacity-100': form.draft }]"
                :placeholder="$t('tasks.inputPlaceholder')"
            />
            <AGHeadlessInputDescription
                class="pointer-events-none px-3 py-2 text-gray-500 group-focus-within:opacity-0 md:px-5 md:py-4"
                :class="{ 'opacity-0': form.draft }"
            />
            <IconButton
                tabindex="-1"
                class="absolute right-1 top-1/2 h-11 w-11 -translate-y-1/2 rounded-lg group-focus-within:flex"
                :class="{ flex: form.draft, hidden: !form.draft }"
                :aria-label="$t('tasks.inputClear')"
                @click="form.reset(), blur()"
            >
                <i-zondicons-close class="h-4 w-4" />
            </IconButton>
        </AGHeadlessInput>

        <TextButton
            submit
            class="w-16 text-sm font-semibold group-focus-within:flex"
            :class="[submitClass, { flex: form.draft, hidden: !form.draft }]"
        >
            {{ $t('tasks.inputSubmit') }}
        </TextButton>
    </AGForm>
</template>

<script setup lang="ts">
import { componentRef, stringInput, stringProp, useForm } from '@aerogel/core';
import type { IAGHeadlessInput } from '@aerogel/core';

import type { ITasksForm } from './TasksForm';

const props = defineProps({
    value: stringProp(),
    inputClass: stringProp(''),
    submitClass: stringProp(''),
});
const emit = defineEmits(['submit']);
const $input = componentRef<IAGHeadlessInput>();
const form = useForm({ draft: stringInput(props.value ?? undefined) });

function blur() {
    if (!(document.activeElement instanceof HTMLElement)) {
        return;
    }

    document.activeElement.blur();
}

function submit() {
    const name = form.draft?.trim();

    blur();
    form.reset();
    name && emit('submit', name);
}

defineExpose<ITasksForm>({ focus: () => $input.value?.$el?.focus() });
</script>
