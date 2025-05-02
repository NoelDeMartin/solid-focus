<template>
    <picture>
        <source type="image/avif" srcset="@/assets/img/tasks/empty.avif">
        <img alt="" src="@/assets/img/tasks/empty.png" v-bind="$attrs">
    </picture>
</template>

<script setup lang="ts">
defineOptions({ inheritAttrs: false });
</script>
