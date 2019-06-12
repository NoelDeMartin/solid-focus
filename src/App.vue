<template>
    <v-app
        :class="{
            'layout-mobile': $ui.mobile,
            'layout-tablet': $ui.tablet,
            'layout-desktop': $ui.desktop,
        }"
    >
        <AppNavigation>
            <Home v-if="$auth.loggedIn" />
            <Login v-else />
        </AppNavigation>
        <component
            v-for="dialog of $ui.dialogs"
            v-bind="dialog.props"
            :key="dialog.id"
            :is="dialog.component"
            :dialog="dialog"
        />
    </v-app>
</template>

<script lang="ts">
import Vue from 'vue';

import AppNavigation from '@/components/AppNavigation.vue';

import Home from '@/screens/home';
import Login from '@/screens/login';

export default Vue.extend({
    components: {
        Home,
        Login,
        AppNavigation,
    },
});
</script>

<style lang="scss">
    @import "./styles/main.scss";
</style>
