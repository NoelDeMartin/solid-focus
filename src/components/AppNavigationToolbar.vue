<template>
    <v-toolbar
        id="app-navigation-toolbar"
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

        <v-spacer />

        <v-menu v-if="$workspaces.active.activeList.editable" bottom left>
            <v-btn
                slot="activator"
                title="Open actions menu"
                dark
                icon
            >
                <v-icon>more_vert</v-icon>
            </v-btn>

            <v-list>
                <v-list-tile @click="editList($workspaces.active.activeList)">
                    <v-icon class="mr-2">edit</v-icon>
                    <v-list-tile-title>Edit list</v-list-tile-title>
                </v-list-tile>
            </v-list>
        </v-menu>

    </v-toolbar>
</template>

<script lang="ts">
import Vue from 'vue';

import List from '@/models/soukai/List';

export default Vue.extend({
    methods: {
        editList(list: List) {
            this.$ui.openDialog(
                () => import('@/dialogs/ListForm.vue'),
                { list },
            );
        },
    },
});
</script>
