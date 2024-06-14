<template>
    <div />
</template>

<style scoped>
div {
    background-image: url('@/assets/img/landing/landscape/sky.png');
    background-image: url('@/assets/img/landing/landscape/sky.avif');
    background-size: auto 100%;
}

@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 2dppx) {
    div {
        background-image: url('@/assets/img/landing/landscape/sky@2x.png');
        background-image: url('@/assets/img/landing/landscape/sky@2x.avif');
    }
}

@media (-webkit-min-device-pixel-ratio: 3), (min-resolution: 3dppx) {
    div {
        background-image: url('@/assets/img/landing/landscape/sky@3x.png');
        background-image: url('@/assets/img/landing/landscape/sky@3x.avif');
    }
}

@media (-webkit-min-device-pixel-ratio: 4), (min-resolution: 4dppx) {
    div {
        background-image: url('@/assets/img/landing/landscape/sky@4x.png');
        background-image: url('@/assets/img/landing/landscape/sky@4x.avif');
    }
}
</style>
