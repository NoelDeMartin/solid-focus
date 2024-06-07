<template>
    <Story group="tasks" :layout="{ type: 'grid' }">
        <Variant title="Playground">
            <TaskCreateForm />

            <template #controls>
                <HstSelect v-model="themeColor" title="Theme Color" :options="themeColorOptions" />
            </template>
        </Variant>

        <Variant title="Default">
            <TaskCreateForm />
        </Variant>

        <Variant title="Hover">
            <TaskCreateForm class=":hover" />
        </Variant>

        <Variant title="Filled">
            <TaskCreateForm value="My new task" />
        </Variant>

        <Variant title="Filled Hover">
            <TaskCreateForm value="My new task" input-class=":hover" />
        </Variant>

        <Variant title="Input Focus">
            <TaskCreateForm input-class=":focus" class=":focus-within" />
        </Variant>

        <Variant title="Submit Focus">
            <TaskCreateForm submit-class=":focus :focus-visible" class=":focus-within" />
        </Variant>
    </Story>
</template>

<script setup lang="ts">
import { useThemeColor } from '@/utils/histoire';

const [themeColor, themeColorOptions] = useThemeColor();
</script>

<style>
.story-taskcreateform {
    grid-template-columns: 750px !important;
}
</style>
