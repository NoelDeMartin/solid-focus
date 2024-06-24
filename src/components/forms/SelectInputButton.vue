<template>
    <ListboxButton ref="$root">
        <slot />
    </ListboxButton>
</template>

<script setup lang="ts">
import { elementRef, injectReactiveOrFail } from '@aerogel/core';
import { watchEffect } from 'vue';

import type { ISelectInput, __SetsSelectElements } from './SelectInput';

const $root = elementRef();
const input = injectReactiveOrFail<ISelectInput>('input', '<SelectInputButton> must be a child of a <SelectInput>');

watchEffect(() => (input as unknown as __SetsSelectElements).__setButtonElement($root.value));
</script>
