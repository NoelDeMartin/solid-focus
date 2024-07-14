<template>
    <Story group="buttons" :layout="{ type: 'grid' }">
        <Variant title="Playground">
            <TextButton :color="color">
                {{ content }}
            </TextButton>

            <template #controls>
                <HstText v-model="content" title="Content" />
                <HstSelect v-model="color" title="Color" :options="colorOptions" />
                <HstSelect v-model="themeColor" title="Theme Color" :options="themeColorOptions" />
            </template>
        </Variant>

        <Variant title="Default">
            <TextButton :color="color">
                {{ content }}
            </TextButton>
        </Variant>

        <Variant title="Hover">
            <TextButton class=":hover" :color="color">
                {{ content }}
            </TextButton>
        </Variant>

        <Variant title="Focus">
            <TextButton class=":focus :focus-visible" :color="color">
                {{ content }}
            </TextButton>
        </Variant>

        <Variant title="Disabled">
            <TextButton disabled :color="color">
                You can't click me
            </TextButton>
        </Variant>

        <Variant title="Colors" :layout="{ width: '300px' }">
            <div class="flex items-center gap-2">
                <TextButton color="primary">
                    Primary
                </TextButton>
                <TextButton color="secondary">
                    Secondary
                </TextButton>
                <TextButton color="danger">
                    Danger
                </TextButton>
                <TextButton color="clear">
                    Clear
                </TextButton>
            </div>
        </Variant>
    </Story>
</template>

<script setup lang="ts">
import { Colors } from '@aerogel/core';
import { invert } from '@noeldemartin/utils';
import { ref } from 'vue';
import type { Color } from '@aerogel/core';

import { useThemeColor } from '@/utils/histoire';

const content = ref('Click me!');
const color = ref<Color>(Colors.Primary);
const colorOptions = invert(Colors);
const [themeColor, themeColorOptions] = useThemeColor();
</script>

<style>
.story-textbutton {
    grid-template-columns: repeat(2, 300px) !important;
}

.story-textbutton .variant-playground,
.story-textbutton .variant-colors {
    grid-column: 1 / -1;
}
</style>
