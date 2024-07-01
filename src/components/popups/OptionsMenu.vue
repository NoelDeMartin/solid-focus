<template>
    <Menu class="relative z-10" as="div">
        <slot />

        <slot name="options">
            <OptionsMenuItems>
                <OptionsMenuItem v-for="(option, index) of activeOptions" :key="index" @click="option.click()">
                    {{ option.text }}
                </OptionsMenuItem>
            </OptionsMenuItems>
        </slot>
    </Menu>
</template>

<script setup lang="ts">
import { arrayFilter } from '@noeldemartin/utils';
import { arrayProp } from '@aerogel/core';
import { computed } from 'vue';

const props = defineProps({ options: arrayProp<{ text: string; click: Function } | false>() });
const activeOptions = computed(() => arrayFilter(props.options));
</script>
