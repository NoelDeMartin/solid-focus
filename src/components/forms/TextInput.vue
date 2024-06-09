<template>
    <AGHeadlessInput ref="$input" v-bind="inputProps" :class="className">
        <AGHeadlessInputLabel class="block text-sm font-medium leading-6 text-gray-900" />
        <div :class="$input?.label && 'mt-2'">
            <div v-if="multiline" class="relative">
                <div :class="renderedFillerClass">
                    {{ $input?.value }}&nbsp;
                </div>
                <AGHeadlessInputTextArea
                    v-bind="attrs"
                    :class="renderedInputClass"
                    @keydown.enter.prevent="form?.submit()"
                />
            </div>
            <AGHeadlessInputInput v-else v-bind="attrs" :class="renderedInputClass" />
            <AGHeadlessInputDescription />
            <AGHeadlessInputError class="mt-1 text-sm text-red-600" />
        </div>
    </AGHeadlessInput>
</template>

<script setup lang="ts">
import { booleanProp, componentRef, extractInputProps, stringProp, useInputAttrs, useInputProps } from '@aerogel/core';
import { computed, inject } from 'vue';
import { twMerge } from 'tailwind-merge';
import type { Form, IAGHeadlessInput } from '@aerogel/core';

defineOptions({ inheritAttrs: false });

const props = defineProps({
    ...useInputProps(),
    multiline: booleanProp(),
    inputClass: stringProp(''),
});
const form = inject<Form | null>('form', null);
const inputProps = extractInputProps(props);
const $input = componentRef<IAGHeadlessInput>();
const [attrs, className] = useInputAttrs();
const renderedFillerClass = computed(() => twMerge('invisible whitespace-pre-wrap', props.inputClass));
const renderedInputClass = computed(() =>
    twMerge(
        [
            props.multiline ? 'absolute inset-0 block h-full resize-none' : '',
            'w-full rounded-lg border-0',
            'text-base text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300',
            'placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[--primary-600]',
        ].join(' '),
        props.inputClass,
    ));
</script>
