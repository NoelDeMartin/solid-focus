<template>
    <AGHeadlessInput ref="$input" v-bind="inputProps" :class="className">
        <AGHeadlessInputLabel class="block text-sm font-medium leading-6 text-gray-900" />
        <div :class="$input?.label && 'mt-2'">
            <AGHeadlessInputInput type="date" v-bind="attrs" :class="renderedInputClass" />
            <AGHeadlessInputDescription />
            <AGHeadlessInputError class="mt-1 text-sm text-red-600" />
        </div>
    </AGHeadlessInput>
</template>

<script setup lang="ts">
import { componentRef, extractInputProps, stringProp, useInputAttrs, useInputProps } from '@aerogel/core';
import { twMerge } from 'tailwind-merge';
import { computed } from 'vue';
import type { IAGHeadlessInput } from '@aerogel/core';

defineOptions({ inheritAttrs: false });

const props = defineProps({
    ...useInputProps(),
    inputClass: stringProp(''),
});
const inputProps = extractInputProps(props);
const $input = componentRef<IAGHeadlessInput>();
const [attrs, className] = useInputAttrs();
const renderedInputClass = computed(() =>
    twMerge(
        [
            $input.value?.errors
                ? 'ring-red-300 placeholder:text-red-300 focus:ring-red-500'
                : 'ring-gray-300 placeholder:text-gray-400 focus:ring-[--primary-600]',
            'w-full rounded-lg border-0 px-2 py-1.5',
            'text-base text-gray-900 shadow-sm ring-1 ring-inset',
            'focus:ring-2 focus:ring-inset',
        ].join(' '),
        props.inputClass,
    ));
</script>
