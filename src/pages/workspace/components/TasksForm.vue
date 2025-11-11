<template>
    <Form
        class="group relative flex gap-2 rounded-lg md:gap-4"
        :class="{
            'bg-gray-100 focus-within:bg-transparent hover:bg-gray-200 focus-within:hover:bg-transparent': !form.draft,
        }"
        :form="form"
        @submit="submit()"
    >
        <HeadlessInput
            name="draft"
            :description="$ui.mobile ? $t('tasks.mobileInputDescription') : $t('tasks.desktopInputDescription')"
            class="relative flex-1"
        >
            <HeadlessInputInput
                ref="$inputRef"
                class="focus:border-primary-500 focus:ring-primary-500 absolute inset-0 size-full rounded-lg border-gray-200 pr-10 pl-3 opacity-0 group-focus-within:opacity-100 hover:bg-gray-50 md:pl-6"
                :aria-label="$t('tasks.inputLabel')"
                :class="[inputClass, { 'opacity-100': form.draft }]"
                :placeholder="$t('tasks.inputPlaceholder')"
                @keydown.esc="$input?.$el?.blur()"
            />
            <HeadlessInputDescription
                class="pointer-events-none px-3 py-2 text-gray-500 group-focus-within:opacity-0 md:px-5 md:py-4"
                :class="{ 'opacity-0': form.draft }"
            />
            <Button
                size="icon"
                variant="ghost"
                tabindex="-1"
                class="absolute top-1/2 right-1 size-11 -translate-y-1/2 rounded-lg group-focus-within:flex"
                :class="{ flex: form.draft, hidden: !form.draft }"
                :aria-label="$t('tasks.inputClear')"
                @click="(form.reset(), blur())"
            >
                <i-zondicons-close class="size-4" />
            </Button>
        </HeadlessInput>

        <Button
            submit
            class="w-16 text-sm font-semibold group-focus-within:flex"
            :class="[submitClass, { flex: form.draft, hidden: !form.draft }]"
        >
            {{ $t('tasks.inputSubmit') }}
        </Button>
    </Form>
</template>

<script setup lang="ts">
import { stringInput, useForm } from '@aerogel/core';
import { useTemplateRef } from 'vue';
import type { HTMLAttributes } from 'vue';

const { inputClass = '', submitClass = '' } = defineProps<{
    inputClass?: HTMLAttributes['class'];
    submitClass?: HTMLAttributes['class'];
}>();
const emit = defineEmits(['submit']);
const $input = useTemplateRef('$inputRef');
const form = useForm({ draft: stringInput() });

function blur() {
    if (!(document.activeElement instanceof HTMLElement)) {
        return;
    }

    document.activeElement.blur();
}

function submit() {
    const name = form.draft;

    blur();
    form.reset();
    name && emit('submit', name);
}

defineExpose({ focus: () => $input.value?.$el?.focus() });
</script>
