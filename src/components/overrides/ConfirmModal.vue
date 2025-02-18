<template>
    <FloatingModal v-slot="{ close }" :title="title || message" :cancellable="false">
        <AGForm :form="form" @submit="close([true, form.data()])">
            <AGMarkdown v-if="title" :text="message" :actions="actions" />
            <ul v-if="checkboxes" class="mt-4 flex flex-col text-sm text-gray-600">
                <li v-for="(checkbox, name) of checkboxes" :key="name">
                    <label class="flex items-center">
                        <input
                            v-model="form[name]"
                            type="checkbox"
                            :required="checkbox.required"
                            class="cursor-pointer rounded border-2 border-[--primary] text-[--primary-500] hover:bg-[--primary-100] checked:hover:text-[--primary-400] focus:ring-[--primary-500] focus-visible:ring-[--primary-500]"
                        >
                        <span class="ml-1.5">{{ checkbox.label }}</span>
                    </label>
                </li>
            </ul>
            <div class="mt-4 flex flex-row-reverse">
                <TextButton submit :color="acceptColor">
                    {{ renderedAcceptText }}
                </TextButton>
                <TextButton :color="cancelColor" class="mr-2" @click="close(false)">
                    {{ renderedCancelText }}
                </TextButton>
            </div>
        </AGForm>
    </FloatingModal>
</template>

<script setup lang="ts">
import { FormFieldTypes, useConfirmModal, useConfirmModalProps, useForm } from '@aerogel/core';
import type { FormFieldDefinition } from '@aerogel/core';

const props = defineProps(useConfirmModalProps());
const { renderedAcceptText, renderedCancelText } = useConfirmModal(props);
const form = useForm(
    Object.entries(props.checkboxes ?? {}).reduce(
        (values, [name, checkbox]) => ({
            [name]: {
                type: FormFieldTypes.Boolean,
                default: checkbox.default,
                required: checkbox.required ? 'required' : undefined,
            },
            ...values,
        }),
        {} as Record<string, FormFieldDefinition>,
    ),
);
</script>
