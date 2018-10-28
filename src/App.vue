<template>
    <v-app>
        <AppNavigation v-if="$auth.loggedIn" />
        <v-content>
            <Home v-if="$auth.loggedIn" />
            <Login v-else />
        </v-content>
    </v-app>
</template>

<script lang="ts">
import Vue from 'vue';

import AppNavigation from '@/components/AppNavigation.vue';

import Home from '@/pages/Home.vue';
import Login from '@/pages/Login.vue';

export default Vue.extend({
    components: {
        Home,
        Login,
        AppNavigation,
    },
});
</script>

<style lang="scss">
    @tailwind preflight;
    @tailwind components;
    @import "~vuetify/dist/vuetify.css";
    @tailwind utilities;
</style>
