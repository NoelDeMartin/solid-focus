<template>
    <picture>
        <source type="image/avif" srcset="@/assets/img/landing/landscape/mountains-mobile.avif">
        <img alt="" src="@/assets/img/landing/landscape/mountains-mobile.png" v-bind="$attrs">
    </picture>
</template>

<script setup lang="ts">
defineOptions({ inheritAttrs: false });
</script>
