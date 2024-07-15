<template>
    <component :is="render.component" v-bind="render.attrs">
        <slot />
    </component>
</template>

<script setup lang="ts">
import { onBeforeRouteUpdate, useRoute } from 'vue-router';
import { stringProp } from '@aerogel/core';
import { TransitionGroup, computed, nextTick, ref, useAttrs, watch } from 'vue';

defineOptions({ inheritAttrs: false });

const props = defineProps({
    tag: stringProp('template'),
    class: stringProp(),
});
const enabled = ref(true);
const route = useRoute();
const attrs = useAttrs();
const render = computed(() => {
    if (!enabled.value) {
        return { component: props.tag, attrs: { class: props.class } };
    }

    return {
        component: TransitionGroup,
        attrs: {
            class: props.class,
            tag: props.tag,
            ...attrs,
        },
    };
});

onBeforeRouteUpdate(() => void (enabled.value = false));
watch(route, () => nextTick(() => (enabled.value = true)));
</script>
