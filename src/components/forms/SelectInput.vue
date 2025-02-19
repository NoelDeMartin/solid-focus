<template>
    <Listbox :model-value="modelValue" @update:model-value="update($event)">
        <ListboxLabel v-if="label" class="sr-only">
            {{ label }}
        </ListboxLabel>
        <slot>
            <SelectInputButton
                class="grid w-full cursor-default grid-cols-1 rounded-md bg-white py-1.5 pl-3 pr-2 text-left text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-[--primary-600] sm:text-sm/6"
            >
                <span class="col-start-1 row-start-1 truncate pr-6">{{ previewText }}</span>
                <i-zondicons-cheveron-down
                    class="col-start-1 row-start-1 size-5 self-center justify-self-end text-gray-500 sm:size-4"
                />
            </SelectInputButton>
            <SelectInputOptions :class="optionsClass">
                <SelectInputOption v-for="(text, option) in options" :key="option" :value="option">
                    <span class="text-sm">
                        {{ text }}
                    </span>
                </SelectInputOption>
            </SelectInputOptions>
        </slot>
    </Listbox>
</template>

<script setup lang="ts">
import { computed, inject, provide, ref } from 'vue';
import { objectProp, stringProp } from '@aerogel/core';
import type { Form, FormFieldValue } from '@aerogel/core';

import type { ISelectInput, __SetsSelectElements } from './SelectInput';

const props = defineProps({
    name: stringProp(),
    label: stringProp(),
    options: objectProp<Record<string, string>>(),
    optionsClass: stringProp(),
});
const emit = defineEmits(['update:modelValue']);
const $button = ref<HTMLElement>();
const $menu = ref<HTMLElement>();
const form = inject<Form | null>('form', null);
const modelValue = computed(() => props.name && form?.getFieldValue(props.name));
const previewText = computed(() => {
    if (typeof modelValue.value !== 'string' && typeof modelValue.value !== 'number') {
        return modelValue.value;
    }

    return props.options?.[modelValue.value] ?? modelValue.value;
});

function update(value: FormFieldValue) {
    if (form && props.name) {
        form.setFieldValue(props.name, value);

        return;
    }

    emit('update:modelValue', value);
}

const api: ISelectInput & __SetsSelectElements = {
    $button,
    $menu,
    __setButtonElement: (element) => ($button.value = element),
    __setMenuElement: (element) => ($menu.value = element),
};

provide('input', api);
defineExpose(api);
</script>
