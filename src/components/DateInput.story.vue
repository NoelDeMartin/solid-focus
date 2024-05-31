<template>
    <Story group="forms" :layout="{ type: 'grid' }">
        <Variant title="Playground">
            <AGForm :form="form">
                <DateInput name="date" :label="label" />
            </AGForm>

            <template #controls>
                <HstText v-model="label" title="Label" />
                <HstCheckbox v-model="hasErrors" title="Errors" />
            </template>
        </Variant>

        <Variant title="Default">
            <DateInput label="What time is it?" />
        </Variant>

        <Variant title="Hover">
            <DateInput label="What time is it?" input-class=":hover" />
        </Variant>

        <Variant title="Focus">
            <DateInput label="What time is it?" input-class=":focus :focus-visible" />
        </Variant>

        <Variant title="Error">
            <AGForm :form="errorForm">
                <DateInput name="date" label="What time is it?" class=":focus :focus-visible" />
            </AGForm>
        </Variant>
    </Story>
</template>

<script setup lang="ts">
import { requiredDateInput, useForm } from '@aerogel/core';
import { ref, watchEffect } from 'vue';

const form = useForm({ date: requiredDateInput() });
const errorForm = useForm({ date: requiredDateInput() });
const label = ref('What time is it?');
const hasErrors = ref(false);

errorForm.submit();

watchEffect(() => (hasErrors.value ? form.submit() : form.reset()));
</script>

<style>
.story-dateinput {
    grid-template-columns: repeat(2, 300px) !important;
}

.story-dateinput .variant-playground {
    grid-column: 1 / -1;
}
</style>
