<template>
    <AGForm
        v-initial-focus
        class="group relative flex gap-4 rounded-lg"
        :class="{
            'bg-gray-100 focus-within:bg-transparent hover:bg-gray-200 focus-within:hover:bg-transparent': !form.draft,
        }"
        :form="form"
        @submit="submit()"
    >
        <AGHeadlessInput
            name="draft"
            :label="$t('tasks.inputLabel')"
            :description="$t('tasks.inputDescription')"
            class="relative flex-1"
        >
            <AGHeadlessInputLabel class="sr-only" />
            <AGHeadlessInputInput
                class="absolute inset-0 h-full w-full rounded-lg border-gray-200 pl-6 opacity-0 hover:bg-gray-50 focus:border-[--primary-500] focus:ring-[--primary-500] group-focus-within:opacity-100"
                :class="[inputClass, { 'opacity-100': form.draft }]"
                :placeholder="$t('tasks.inputPlaceholder')"
            />
            <AGHeadlessInputDescription
                class="pointer-events-none px-5 py-4 text-gray-500 group-focus-within:opacity-0"
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
import { stringInput, stringProp, useForm } from '@aerogel/core';

const props = defineProps({
    value: stringProp(),
    inputClass: stringProp(''),
    submitClass: stringProp(''),
});
const emit = defineEmits(['submit']);
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
</script>
