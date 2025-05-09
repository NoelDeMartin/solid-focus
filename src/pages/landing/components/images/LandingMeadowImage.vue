<template>
    <picture>
        <source
            type="image/avif"
            srcset="
                @/assets/img/landing/landscape/meadow@2x.avif 1920w,
                @/assets/img/landing/landscape/meadow.avif    1280w
            "
            sizes="100vw"
        >
        <img alt="" src="@/assets/img/landing/landscape/meadow.png" v-bind="$attrs">
    </picture>
</template>

<script setup lang="ts">
defineOptions({ inheritAttrs: false });
</script>
