<template>
    <Listbox :model-value="modelValue" @update:model-value="update($event)">
        <ListboxLabel v-if="label" class="sr-only">
            {{ label }}
        </ListboxLabel>
        <slot />
    </Listbox>
</template>

<script setup lang="ts">
import { computed, inject, provide, ref } from 'vue';
import { stringProp } from '@aerogel/core';
import type { Form, FormFieldValue } from '@aerogel/core';

import type { ISelectInput, __SetsSelectElements } from './SelectInput';

const props = defineProps({
    name: stringProp(),
    label: stringProp(),
});
const emit = defineEmits(['update:modelValue']);
const $button = ref<HTMLElement>();
const $menu = ref<HTMLElement>();
const form = inject<Form | null>('form', null);
const modelValue = computed(() => props.name && form?.getFieldValue(props.name));

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
