<template>
    <div class="flex h-full flex-col items-center justify-center px-4 md:pb-24">
        <TasksStartImage class="h-56 object-contain object-bottom" />
        <h2 class="mt-6 text-xl leading-6 font-semibold text-gray-900">
            {{ $t('tasks.startTitle') }}
        </h2>
        <Markdown lang-key="tasks.startMessage" class="mt-2 text-center font-light text-gray-600" />
        <Form
            :form="form"
            class="mt-6 flex max-w-full flex-col gap-2 md:flex-row"
            @submit="$emit('create', form.draft)"
        >
            <Input
                :aria-label="$t('tasks.inputLabel')"
                name="draft"
                :placeholder="$t('tasks.inputPlaceholder')"
                class="w-80 max-w-full"
            />
            <Button submit>
                {{ $t('tasks.startSubmit') }}
            </Button>
        </Form>
    </div>
</template>

<script setup lang="ts">
import { requiredStringInput, useForm } from '@aerogel/core';

defineEmits(['create']);

const form = useForm({ draft: requiredStringInput() });
</script>
