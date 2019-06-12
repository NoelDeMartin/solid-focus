<template>
    <v-toolbar
        :height="$ui.toolbarHeight"
        color="primary"
        dark
    >
        <v-toolbar-side-icon
            title="Toggle navigation drawer"
            @click="$ui.toggleNavigationDrawer()"
        >
            <v-icon>menu</v-icon>
        </v-toolbar-side-icon>
        <v-toolbar-title v-if="!$workspaces.empty">
            {{ $workspaces.active.activeList.name }}
        </v-toolbar-title>
    </v-toolbar>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({});
</script>
