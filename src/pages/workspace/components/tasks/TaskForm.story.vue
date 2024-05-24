<template>
    <Story :layout="{ type: 'grid' }">
        <Variant title="Playground">
            <TaskForm />

            <template #controls>
                <HstSelect v-model="color" title="Color" :options="colorOptions" />
            </template>
        </Variant>

        <Variant title="Default">
            <TaskForm />
        </Variant>

        <Variant title="Hover">
            <TaskForm class=":hover" />
        </Variant>

        <Variant title="Filled">
            <TaskForm value="My new task" />
        </Variant>

        <Variant title="Filled Hover">
            <TaskForm value="My new task" input-class=":hover" />
        </Variant>

        <Variant title="Input Focus">
            <TaskForm input-class=":focus" class=":focus-within" />
        </Variant>

        <Variant title="Submit Focus">
            <TaskForm submit-class=":focus :focus-visible" class=":focus-within" />
        </Variant>
    </Story>
</template>

<script setup lang="ts">
import { invert } from '@noeldemartin/utils';
import { computed, ref, watchEffect } from 'vue';

const Colors = {
    Red: 'red',
    Green: 'green',
    Blue: 'blue',
} as const;

type Color = (typeof Colors)[keyof typeof Colors];

const COLOR_VALUES: Record<Color, Record<string, string>> = {
    [Colors.Red]: {
        50: '#fef2f2',
        100: '#fee2e2',
        200: '#fecaca',
        300: '#fca5a5',
        400: '#f87171',
        500: '#ef4444',
        600: '#dc2626',
        700: '#b91c1c',
        800: '#991b1b',
        900: '#7f1d1d',
        950: '#450a0a',
    },
    [Colors.Green]: {
        50: '#f0fdf4',
        100: '#dcfce7',
        200: '#bbf7d0',
        300: '#86efac',
        400: '#4ade80',
        500: '#22c55e',
        600: '#16a34a',
        700: '#15803d',
        800: '#166534',
        900: '#14532d',
        950: '#052e16',
    },
    [Colors.Blue]: {
        50: '#eff6ff',
        100: '#dbeafe',
        200: '#bfdbfe',
        300: '#93c5fd',
        400: '#60a5fa',
        500: '#3b82f6',
        600: '#2563eb',
        700: '#1d4ed8',
        800: '#1e40af',
        900: '#1e3a8a',
        950: '#172554',
    },
};

const color = ref<Color>(Colors.Blue);
const colorOptions = invert(Colors);
const workspaceColors = computed(() => COLOR_VALUES[color.value]);

watchEffect((onCleanup) => {
    Object.entries(workspaceColors.value).forEach(([name, value]) => {
        document.body.style.setProperty(`--primary-${name}`, value);
    });

    onCleanup(() => {
        Object.keys(workspaceColors.value).forEach((name) => {
            document.body.style.removeProperty(`--primary-${name}`);
        });
    });
});
</script>

<style>
.story-taskform {
    grid-template-columns: 750px !important;
}
</style>
