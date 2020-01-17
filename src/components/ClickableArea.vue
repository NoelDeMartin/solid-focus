<template>
    <button
        v-ripple
        class="clickable-area rounded"
        type="button"
        @click="$emit('click')"
    >
        <slot />
    </button>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
});
</script>

<style lang="scss">
    // Replicate some v-btn styles
    .clickable-area {
        position: relative;

        &::before {
            border-radius: inherit;
            content: ' ';
            position: absolute;
            opacity: .12;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            transition: .3s cubic-bezier(.25, .8, .5, 1);
        }

        &:hover::before {
            background-color: currentColor;
        }

    }
</style>
