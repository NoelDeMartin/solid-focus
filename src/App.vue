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
        <v-snackbar
            :value="$ui.snackbar"
            :timeout="0"
            :bottom="true"
            class="m-2"
        >
            <div v-if="$ui.snackbar" class="flex items-center justify-start">
                <v-progress-circular
                    v-if="$ui.snackbar.loading"
                    :indeterminate="true"
                    :size="24"
                    :width="2"
                    class="mr-4"
                />
                {{ $ui.snackbar.message }}
            </div>
        </v-snackbar>
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
