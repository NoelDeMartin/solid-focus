<template>
    <FloatingModal v-slot="{ close }" :title="title || message" :cancellable="false">
        <AGMarkdown v-if="title" :text="message" />
        <AGForm :form="form" class="mt-2" @submit="close(form.draft)">
            <TextInput name="draft" :placeholder="placeholder" :label="label" />
            <div class="mt-4 flex flex-row-reverse">
                <TextButton :color="acceptColor" submit>
                    {{ renderedAcceptText }}
                </TextButton>
                <TextButton :color="cancelColor" class="mr-2" @click="close()">
                    {{ renderedCancelText }}
                </TextButton>
            </div>
        </AGForm>
    </FloatingModal>
</template>

<script setup lang="ts">
import { requiredStringInput, useForm, usePromptModal, usePromptModalProps } from '@aerogel/core';

const props = defineProps(usePromptModalProps());
const form = useForm({ draft: requiredStringInput(props.defaultValue ?? '') });
const { renderedAcceptText, renderedCancelText } = usePromptModal(props);
</script>
