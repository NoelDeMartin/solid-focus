<template>
    <Story group="buttons" :layout="{ type: 'grid' }">
        <Variant title="Playground">
            <IconButton>
                <component :is="iconComponent" class="h-4 w-4" />
            </IconButton>

            <template #controls>
                <HstSelect v-model="icon" title="Icon" :options="iconOptions" />
            </template>
        </Variant>

        <Variant title="Default">
            <IconButton> <component :is="iconComponent" class="h-4 w-4" /> </IconButton>
        </Variant>

        <Variant title="Hover">
            <IconButton class=":hover">
                <component :is="iconComponent" class="h-4 w-4" />
            </IconButton>
        </Variant>

        <Variant title="Focus">
            <IconButton class=":focus :focus-visible">
                <component :is="iconComponent" class="h-4 w-4" />
            </IconButton>
        </Variant>

        <Variant title="Disabled">
            <IconButton disabled>
                <component :is="iconComponent" class="h-4 w-4" />
            </IconButton>
        </Variant>
    </Story>
</template>

<script setup lang="ts">
import IconCheckmark from '~icons/zondicons/checkmark';
import IconClose from '~icons/zondicons/close';

import { invert } from '@noeldemartin/utils';
import { computed, ref } from 'vue';

const Icons = {
    Checkmark: 'Checkmark',
    Close: 'Close',
} as const;

type Icon = (typeof Icons)[keyof typeof Icons];

const icon = ref<Icon>(Icons.Checkmark);
const iconOptions = invert(Icons);
const iconComponent = computed(
    () =>
        ({
            [Icons.Checkmark]: IconCheckmark,
            [Icons.Close]: IconClose,
        }[icon.value]),
);
</script>

<style>
.story-iconbutton {
    grid-template-columns: repeat(2, 300px) !important;
}

.story-iconbutton .variant-playground {
    grid-column: 1 / -1;
}
</style>
