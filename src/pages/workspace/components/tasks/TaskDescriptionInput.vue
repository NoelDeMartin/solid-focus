<template>
    <AGHeadlessInput ref="$input" v-bind="inputProps">
        <AGHeadlessInputLabel class="block text-sm font-medium leading-6 text-gray-900" />
        <div :class="$input?.label && 'mt-2'">
            <div class="relative">
                <div :class="renderedFillerClass">
                    {{ $input?.value }}&nbsp;
                </div>
                <AGHeadlessInputTextArea v-bind="attrs" :class="renderedInputClass" />
            </div>
        </div>
        <AGHeadlessInputDescription class="mt-3 text-sm leading-6 text-gray-600" />
        <AGHeadlessInputError class="mt-1 text-sm text-red-600" />
    </AGHeadlessInput>
</template>

<script setup lang="ts">
import { componentRef, extractInputProps, stringProp, useInputAttrs, useInputProps } from '@aerogel/core';
import { computed } from 'vue';
import { twMerge } from 'tailwind-merge';
import type { IAGHeadlessInput } from '@aerogel/core';

defineOptions({ inheritAttrs: false });

const $input = componentRef<IAGHeadlessInput>();
const props = defineProps({
    ...useInputProps(),
    inputClass: stringProp(''),
});
const [attrs] = useInputAttrs();
const inputProps = extractInputProps(props);
const renderedFillerClass = computed(() =>
    twMerge('invisible text-base whitespace-pre-wrap px-2 py-1.5', props.inputClass));
const renderedInputClass = computed(() =>
    twMerge(
        [
            $input.value?.errors
                ? 'ring-red-300 placeholder:text-red-300 focus:ring-red-500'
                : 'ring-gray-300 placeholder:text-gray-400 focus:ring-[--primary-600]',
            'absolute inset-0 block h-full w-full rounded-lg border-0 px-2 py-1.5 text-gray-900 shadow-sm',
            'text-base resize-none ring-1 ring-inset',
            'focus:ring-2 focus:ring-inset',
        ].join(' '),
        props.inputClass,
    ));
</script>
