<template>
    <div class="flex h-screen w-screen overflow-hidden">
        <AppNavigationDrawer v-if="$auth.loggedIn" />
        <div class="flex flex-col flex-grow">
            <AppNavigationToolbar v-if="$auth.loggedIn" />
            <div class="flex flex-grow">
                <main class="flex-grow">
                    <slot/>
                </main>
            </div>
        </div>
        <portal-target slim name="app-navigation-overlay" />
    </div>
</template>

<script lang="ts">
import Vue from 'vue';

import AppNavigationDrawer from '@/components/AppNavigationDrawer.vue';
import AppNavigationToolbar from '@/components/AppNavigationToolbar.vue';

export default Vue.extend({
    components: {
        AppNavigationToolbar,
        AppNavigationDrawer,
    },
});
</script>
