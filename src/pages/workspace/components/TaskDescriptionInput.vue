<template>
    <HeadlessInput ref="$inputRef" v-bind="props" :class="rootClasses">
        <HeadlessInputLabel class="block text-sm leading-6 font-medium text-gray-900" />
        <div :class="$input?.label && 'mt-2'">
            <div class="relative">
                <div :class="renderedFillerClass">
                    {{ $input?.value }}&nbsp;
                </div>
                <HeadlessInputTextArea v-bind="inputAttrs" :class="renderedInputClasses" />
            </div>
        </div>
        <HeadlessInputDescription class="mt-3 text-sm leading-6 text-gray-600" />
        <HeadlessInputError class="mt-1 text-sm text-red-600" />
    </HeadlessInput>
</template>

<script setup lang="ts">
import { computed, useTemplateRef } from 'vue';
import { classes, useInputAttrs } from '@aerogel/core';
import type { HTMLAttributes } from 'vue';
import type { InputEmits, InputProps } from '@aerogel/core';

defineOptions({ inheritAttrs: false });
defineEmits<InputEmits>();

const $input = useTemplateRef('$inputRef');
const { inputClass, ...props } = defineProps<InputProps & { inputClass?: HTMLAttributes['class'] }>();
const [inputAttrs, rootClasses] = useInputAttrs();
const renderedFillerClass = computed(() => classes('invisible text-base whitespace-pre-wrap px-2 py-1.5', inputClass));
const renderedInputClasses = computed(() => {
    // Type inference fails without this cast, no idea why :/
    const hasErrors = !!$input.value?.errors as boolean;

    return classes(
        'absolute inset-0 block size-full rounded-lg border-0 px-2 py-1.5 text-gray-900 shadow-xs',
        'text-base resize-none ring-1 ring-inset',
        'focus:ring-2 focus:ring-inset',
        {
            'ring-red-300 placeholder:text-red-300 focus:ring-red-500': hasErrors,
            'ring-gray-300 placeholder:text-gray-400 focus:ring-primary-600': !hasErrors,
        },
        inputClass,
    );
});
</script>
