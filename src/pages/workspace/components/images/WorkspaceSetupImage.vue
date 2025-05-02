<template>
    <picture>
        <source type="image/avif" srcset="@/assets/img/workspaces/setup.avif">
        <img alt="" src="@/assets/img/workspaces/setup.png" v-bind="$attrs">
    </picture>
</template>

<script setup lang="ts">
defineOptions({ inheritAttrs: false });
</script>
