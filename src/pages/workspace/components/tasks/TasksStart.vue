<template>
    <div class="flex h-full flex-col items-center justify-center px-4 md:pb-24">
        <div class="flex h-56 max-h-full items-end justify-center">
            <img src="@/assets/img/tasks/start.avif" class="max-h-full" alt="">
        </div>
        <h2 class="mt-6 text-xl font-semibold leading-6 text-gray-900">
            {{ $t('tasks.startTitle') }}
        </h2>
        <AGMarkdown lang-key="tasks.startMessage" class="mt-2 text-center font-light text-gray-600" />
        <AGForm
            :form="form"
            class="mt-6 flex max-w-full flex-col gap-2 md:flex-row"
            @submit="$emit('create', form.draft.trim())"
        >
            <TextInput
                :aria-label="$t('tasks.inputLabel')"
                name="draft"
                :placeholder="$t('tasks.inputPlaceholder')"
                class="w-80 max-w-full"
            />
            <TextButton submit>
                {{ $t('tasks.startSubmit') }}
            </TextButton>
        </AGForm>
    </div>
</template>

<script setup lang="ts">
import { requiredStringInput, useForm } from '@aerogel/core';

defineEmits(['create']);

const form = useForm({ draft: requiredStringInput() });
</script>
