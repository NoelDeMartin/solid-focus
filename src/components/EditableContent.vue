<template>
    <div class="relative" :class="{ 'pointer-events-none': disabled && !editing }">
        <div v-if="!editing" :class="renderedContentClass">
            <slot />
        </div>
        <span v-else :class="renderedFillerClass">
            {{ draft }}
        </span>
        <form class="w-full" @submit.prevent="$input?.blur()">
            <input
                ref="$input"
                v-model="draft"
                type="text"
                tabindex="-1"
                :class="[renderedInputClass, { 'opacity-0': !editing }]"
                @keyup="$emit('update', draft)"
                @focus="startEditing()"
                @blur="stopEditing()"
            >
        </form>
    </div>
</template>

<script setup lang="ts">
import { computed, ref, watchEffect } from 'vue';
import { booleanProp, requiredStringProp, stringProp } from '@aerogel/core';
import { twMerge } from 'tailwind-merge';

const emit = defineEmits(['update', 'save']);
const props = defineProps({
    contentClass: stringProp(),
    text: requiredStringProp(),
    disabled: booleanProp(),
});
const $input = ref<HTMLElement>();
const editing = ref<string | null>(null);
const draft = ref(props.text);
const renderedContentClass = computed(() => twMerge('inline whitespace-pre', props.contentClass));
const renderedFillerClass = computed(() => twMerge('invisible whitespace-pre', props.contentClass));
const renderedInputClass = computed(() =>
    twMerge('absolute inset-0 h-full w-full resize-none border-0 bg-transparent p-0 focus:ring-0', props.contentClass));

function startEditing() {
    editing.value = props.text;
}

function stopEditing() {
    if (!editing.value) {
        return;
    }

    if (draft.value.trim().length === 0) {
        draft.value = editing.value;

        emit('update', draft.value);
    }

    editing.value = null;

    emit('save');
}

watchEffect(() => (draft.value = props.text));
</script>
