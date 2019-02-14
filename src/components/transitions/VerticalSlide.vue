<template>
    <transition-group
        :tag="tag"
        :duration="300"
        class="vertical-slide-transition-group"
        name="vertical-slide-transition"
    >
        <slot />
    </transition-group>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
    props: {
        tag: {
            type: String,
            default: 'div',
        },
    },
});
</script>

<style lang="scss">
    .vertical-slide-transition-group > * {
        overflow: hidden;
        transition: all .3s !important;
    }

    .vertical-slide-transition-enter,
    .vertical-slide-transition-leave-to {
        height: 0;
    }
</style>
