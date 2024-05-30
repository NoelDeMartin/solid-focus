<template>
    <Story group="tasks" :layout="{ type: 'grid' }">
        <Variant title="Playground">
            <AGForm :form="form">
                <TaskDescriptionInput name="food" :label="label" :placeholder="placeholder" />
            </AGForm>

            <template #controls>
                <HstText v-model="label" title="Label" />
                <HstText v-model="placeholder" title="Placeholder" />
                <HstCheckbox v-model="hasErrors" title="Errors" />
            </template>
        </Variant>

        <Variant title="Default">
            <TaskDescriptionInput label="What's the best food?" placeholder="Ramen" />
        </Variant>

        <Variant title="Hover">
            <TaskDescriptionInput label="What's the best food?" placeholder="Ramen" input-class=":hover" />
        </Variant>

        <Variant title="Focus">
            <TaskDescriptionInput
                label="What's the best food?"
                placeholder="Ramen"
                input-class=":focus :focus-visible"
            />
        </Variant>

        <Variant title="Error">
            <AGForm :form="errorForm">
                <TaskDescriptionInput
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
.story-taskdescriptioninput {
    grid-template-columns: repeat(2, 300px) !important;
}

.story-taskdescriptioninput .variant-playground {
    grid-column: 1 / -1;
}
</style>
