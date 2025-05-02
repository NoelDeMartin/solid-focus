<template>
    <picture>
        <source type="image/avif" srcset="@/assets/img/tasks/start.avif">
        <img alt="" src="@/assets/img/tasks/start.png" v-bind="$attrs">
    </picture>
</template>

<script setup lang="ts">
defineOptions({ inheritAttrs: false });
</script>
