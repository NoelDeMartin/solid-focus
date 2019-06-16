<template>
    <transition-group
        :tag="tag"
        :duration="$ui.styles.transitions.normal"
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
$transition-duration: config('transitions.normal');

.vertical-slide-transition-group > * {
    overflow: hidden;
    transition: all $transition-duration !important;
}

.vertical-slide-transition-enter,
.vertical-slide-transition-leave-to {
    height: 0 !important;
}
</style>
