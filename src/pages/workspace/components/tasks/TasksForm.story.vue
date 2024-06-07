<template>
    <Story group="tasks" :layout="{ type: 'grid' }">
        <Variant title="Playground">
            <TasksForm />

            <template #controls>
                <HstSelect v-model="themeColor" title="Theme Color" :options="themeColorOptions" />
            </template>
        </Variant>

        <Variant title="Default">
            <TasksForm />
        </Variant>

        <Variant title="Hover">
            <TasksForm class=":hover" />
        </Variant>

        <Variant title="Filled">
            <TasksForm value="My new task" />
        </Variant>

        <Variant title="Filled Hover">
            <TasksForm value="My new task" input-class=":hover" />
        </Variant>

        <Variant title="Input Focus">
            <TasksForm input-class=":focus" class=":focus-within" />
        </Variant>

        <Variant title="Submit Focus">
            <TasksForm submit-class=":focus :focus-visible" class=":focus-within" />
        </Variant>
    </Story>
</template>

<script setup lang="ts">
import { useThemeColor } from '@/utils/histoire';

const [themeColor, themeColorOptions] = useThemeColor();
</script>

<style>
.story-tasksform {
    grid-template-columns: 750px !important;
}
</style>
