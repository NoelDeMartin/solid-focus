<template>
    <ListboxOption v-slot="{ active, selected }" as="template">
        <li class="p-1">
            <div
                class="relative flex max-w-[calc(100vw-2rem)] select-none items-center truncate rounded-md px-2 py-1 *:truncate"
                :class="{
                    'bg-gray-100': active,
                    'cursor-default': !action,
                    'cursor-pointer': action,
                    'font-semibold': selected,
                    'opacity-50': !selected && !action,
                }"
                :style="active && activeStyle"
            >
                <slot />
            </div>
        </li>
    </ListboxOption>
</template>

<script setup lang="ts">
import { booleanProp, mixedProp } from '@aerogel/core';

defineProps({
    action: booleanProp(),
    activeStyle: mixedProp(),
});
</script>
