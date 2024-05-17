<template>
    <picture>
        <source
            type="image/avif"
            srcset="
                @/assets/img/landing/landscape/mountains@4x.avif 4096w,
                @/assets/img/landing/landscape/mountains@3x.avif 2560w,
                @/assets/img/landing/landscape/mountains@2x.avif 1920w,
                @/assets/img/landing/landscape/mountains.avif    1280w
            "
            sizes="100vw"
        >
        <img alt="" src="@/assets/img/landing/landscape/mountains.png" v-bind="$attrs">
    </picture>
</template>

<script setup lang="ts">
defineOptions({ inheritAttrs: false });
</script>
