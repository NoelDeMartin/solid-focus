<template>
    <component :is="render.component" v-bind="render.attrs">
        <slot />
    </component>
</template>

<script setup lang="ts">
import { onBeforeRouteUpdate, useRoute } from 'vue-router';
import { TransitionGroup, computed, nextTick, ref, useAttrs, watch } from 'vue';
import type { HTMLAttributes } from 'vue';

defineOptions({ inheritAttrs: false });

const { tag = 'template', class: className = '' } = defineProps<{
    tag?: string;
    class?: HTMLAttributes['class'];
}>();
const enabled = ref(true);
const route = useRoute();
const attrs = useAttrs();
const render = computed(() => {
    if (!enabled.value) {
        return { component: tag, attrs: { class: className } };
    }

    return {
        component: TransitionGroup,
        attrs: {
            class: className,
            tag,
            ...attrs,
        },
    };
});

onBeforeRouteUpdate(() => void (enabled.value = false));
watch(route, () => nextTick(() => (enabled.value = true)));
</script>
