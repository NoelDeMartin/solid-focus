<template>
    <AGHeadlessSnackbar class="flex items-center gap-2 rounded-lg p-2 shadow-lg ring-1" :class="colorClasses">
        <AGMarkdown :text="message" inline />

        <TextButton
            v-for="(action, i) of actions"
            :key="i"
            :color="color"
            :class="color === 'secondary' && 'hover:bg-gray-800 focus-visible:outline-gray-700'"
            class="rounded-md"
            @click="activate(action)"
        >
            {{ action.text }}
        </TextButton>
    </AGHeadlessSnackbar>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Colors, useSnackbar, useSnackbarProps } from '@aerogel/core';

const props = defineProps(useSnackbarProps());
const { activate } = useSnackbar(props);

const colorClasses = computed(() => {
    switch (props.color) {
        case Colors.Danger:
            return 'bg-red-50 text-red-900 ring-red-100 ring-opacity-50';
        case Colors.Secondary:
        default:
            return 'bg-gray-900 text-white ring-black';
    }
});
</script>
