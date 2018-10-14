<template>
    <v-app>
        <AppNavigation v-if="$auth.loggedIn" />
        <v-content>
            <Splash v-if="loading"/>
            <Home v-else-if="$auth.loggedIn" />
            <Login v-else />
        </v-content>
    </v-app>
</template>

<script lang="ts">
import Vue from 'vue';

import AppNavigation from '@/components/AppNavigation.vue';

import Home from '@/pages/Home.vue';
import Login from '@/pages/Login.vue';
import Splash from '@/pages/Splash.vue';

export default Vue.extend({
    components: {
        Home,
        Login,
        Splash,
        AppNavigation,
    },
    data() {
        return {
            loading: true,
        };
    },
    mounted() {
        Promise.all([
            this.$auth.ready,
            this.$ui.ready,
        ])
            .then(() => {
                this.loading = false;
            });
    },
});
</script>

<style lang="scss">
    @tailwind preflight;
    @tailwind components;
    @import "~vuetify/dist/vuetify.css";
    @tailwind utilities;
</style>
