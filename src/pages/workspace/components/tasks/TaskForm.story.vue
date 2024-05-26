<template>
    <Story group="tasks" :layout="{ type: 'grid' }">
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
import { useWorkspaceColor } from '@/utils/histoire';

const [color, colorOptions] = useWorkspaceColor();
</script>

<style>
.story-taskform {
    grid-template-columns: 750px !important;
}
</style>
