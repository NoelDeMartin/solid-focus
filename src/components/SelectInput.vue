<template>
    <Listbox>
        <ListboxLabel v-if="label" class="sr-only">
            {{ label }}
        </ListboxLabel>
        <div class="relative">
            <slot />
        </div>
    </Listbox>
</template>

<script setup lang="ts">
import { stringProp } from '@aerogel/core';

defineProps({ label: stringProp() });
</script>
