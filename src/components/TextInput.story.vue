<template>
    <Story group="forms" :layout="{ type: 'grid' }">
        <Variant title="Playground">
            <AGForm :form="form">
                <TextInput name="food" :label="label" :placeholder="placeholder" />
            </AGForm>

            <template #controls>
                <HstText v-model="label" title="Label" />
                <HstText v-model="placeholder" title="Placeholder" />
                <HstCheckbox v-model="hasErrors" title="Errors" />
            </template>
        </Variant>

        <Variant title="Default">
            <TextInput label="What's the best food?" placeholder="Ramen" />
        </Variant>

        <Variant title="Hover">
            <TextInput label="What's the best food?" placeholder="Ramen" input-class=":hover" />
        </Variant>

        <Variant title="Focus">
            <TextInput label="What's the best food?" placeholder="Ramen" input-class=":focus :focus-visible" />
        </Variant>

        <Variant title="Error">
            <AGForm :form="errorForm">
                <TextInput
                    name="food"
                    label="What's the best food?"
                    placeholder="Ramen"
                    class=":focus :focus-visible"
                />
            </AGForm>
        </Variant>
    </Story>
</template>

<script setup lang="ts">
import { requiredStringInput, useForm } from '@aerogel/core';
import { ref, watchEffect } from 'vue';

const form = useForm({ food: requiredStringInput() });
const errorForm = useForm({ food: requiredStringInput() });
const label = ref('What\'s the best food?');
const placeholder = ref('Ramen');
const hasErrors = ref(false);

errorForm.submit();

watchEffect(() => (hasErrors.value ? form.submit() : form.reset()));
</script>

<style>
.story-textinput {
    grid-template-columns: repeat(2, 300px) !important;
}

.story-textinput .variant-playground {
    grid-column: 1 / -1;
}
</style>
