<template>
    <portal to="app-navigation-overlay">
        <transition name="fade">
            <div
                v-if="active"
                class="fixed pin bg-black opacity-25 cursor-pointer z-10"
                @click="$emit('click')"
            />
        </transition>
    </portal>
</template>

<script>
import Vue from 'vue';

export default Vue.extend({
    props: {
        active: {
            type: Boolean,
            default: true,
        },
    },
});
</script>

<style>
.fade-enter-active,
.fade-leave-active {
    transition: opacity .3s;
}

.fade-enter,
.fade-leave-to {
    opacity: 0 !important;
}
</style>
