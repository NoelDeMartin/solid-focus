<template>
    <div class="flex h-full flex-col items-center justify-center pb-24">
        <div class="relative max-h-56 w-full flex-1">
            <img src="@/assets/img/tasks/start.avif" class="absolute right-1/2 h-full translate-x-1/2" alt="">
        </div>
        <h2 class="mt-6 text-xl font-semibold leading-6 text-gray-900">
            {{ $t('tasks.startTitle') }}
        </h2>
        <AGMarkdown lang-key="tasks.startMessage" class="mt-2 text-center font-light text-gray-600" />
        <AGForm :form="form" class="mt-6 flex gap-2" @submit="$emit('create', form.draft.trim())">
            <TextInput name="draft" :placeholder="$t('tasks.placeholder')" />
            <TextButton submit>
                {{ $t('ui.create') }}
            </TextButton>
        </AGForm>
    </div>
</template>

<script setup lang="ts">
import { requiredStringInput, useForm } from '@aerogel/core';

defineEmits(['create']);

const form = useForm({ draft: requiredStringInput() });
</script>
