<template>
    <picture>
        <source
            type="image/avif"
            srcset="@/assets/img/landing/landscape/sky@2x.avif 1920w, @/assets/img/landing/landscape/sky.avif 1280w"
            sizes="100vw"
        >
        <img alt="" src="@/assets/img/landing/landscape/sky.png" v-bind="$attrs">
    </picture>
</template>
