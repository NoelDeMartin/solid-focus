<template>
    <Listbox :model-value="modelValue" @update:model-value="update($event)">
        <ListboxLabel v-if="label" class="sr-only">
            {{ label }}
        </ListboxLabel>
        <div class="relative">
            <slot />
        </div>
    </Listbox>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue';
import { stringProp } from '@aerogel/core';
import type { Form, FormFieldValue } from '@aerogel/core';

const props = defineProps({
    name: stringProp(),
    label: stringProp(),
});
const emit = defineEmits(['update:modelValue']);
const form = inject<Form | null>('form', null);
const modelValue = computed(() => props.name && form?.getFieldValue(props.name));

function update(value: FormFieldValue) {
    if (form && props.name) {
        form.setFieldValue(props.name, value);

        return;
    }

    emit('update:modelValue', value);
}
</script>
