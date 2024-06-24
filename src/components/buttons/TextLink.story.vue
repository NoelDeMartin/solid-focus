<template>
    <Story group="buttons" :layout="{ type: 'grid' }">
        <Variant title="Playground">
            {{ contentParts[0] }}
            <TextLink> {{ contentParts[1] }} </TextLink>
            {{ contentParts[2] }}

            <template #controls>
                <HstText v-model="content" title="Content" />
            </template>
        </Variant>

        <Variant title="Default">
            {{ contentParts[0] }}
            <TextLink> {{ contentParts[1] }} </TextLink>
            {{ contentParts[2] }}
        </Variant>

        <Variant title="Hover">
            {{ contentParts[0] }}
            <TextLink class=":hover">
                {{ contentParts[1] }}
            </TextLink>
            {{ contentParts[2] }}
        </Variant>

        <Variant title="Focus">
            {{ contentParts[0] }}
            <TextLink class=":focus :focus-visible">
                {{ contentParts[1] }}
            </TextLink>
            {{ contentParts[2] }}
        </Variant>
    </Story>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { stringMatch } from '@noeldemartin/utils';

const content = ref('You can [click here] for more details');
const contentParts = computed(
    () => stringMatch<3, 3>(content.value, /(.*?)\[(.*?)\](.*)/)?.slice(1) as [string, string, string],
);
</script>

<style>
.story-textlink {
    grid-template-columns: repeat(2, 300px) !important;
}

.story-textlink .variant-playground {
    grid-column: 1 / -1;
}
</style>
