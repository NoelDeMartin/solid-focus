<template>
    <portal to="app-navigation-sidepanel">
        <aside
            id="app-navigation-sidepanel"
            :class="{ closed: !open }"
            :style="{
                height: $ui.mobile
                    ? '100vh'
                    : `calc(100vh - ${$ui.toolbarHeight}px)`,
            }"
            class="z-20 bg-white flex-no-shrink"
        >
            <slot/>
        </aside>
    </portal>
</template>

<script>
import Vue from 'vue';

export default Vue.extend({
    props: {
        open: {
            type: Boolean,
            default: true,
        },
    },
});
</script>

<style lang="scss">
$navigation-sidepanel-width: config('width.panel-large');

#app-navigation-sidepanel {
    position: relative;
    margin-right: 0;

    transition: margin-right 0.3s;

    &::after {
        content: " ";
        position: absolute;
        background-color: rgba(0, 0, 0, .12);
        width: 1px;
        left: 0;
        top: 0;
        bottom: 0;
    }

    .layout-mobile & {
        position: fixed;
        top: 0;
        right: 0;
        width: 100vw;
        height: 100vh;

        &.closed {
            margin-right: -100vw;
        }

    }

    .layout-desktop & {
        width: $navigation-sidepanel-width;

        &.closed {
            margin-right: calc(-1 * #{$navigation-sidepanel-width});
        }

    }

}
</style>
