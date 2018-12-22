<template>
    <div>
        <v-toolbar app dark color="primary">
            <v-toolbar-side-icon @click="collapsed = !collapsed">
                <v-icon>menu</v-icon>
            </v-toolbar-side-icon>
            <v-toolbar-title v-if="!$workspaces.empty">
                {{ $workspaces.active.activeList.name }}
            </v-toolbar-title>
        </v-toolbar>
        <v-navigation-drawer
            :mobile-break-point="$ui.mobileBreakpoint"
            :mini-variant="!$ui.mobile && collapsed"
            :value="!$ui.mobile || !collapsed"
            :temporary="$ui.mobile"
            app
            @input="toggleMenu"
        >
            <v-toolbar flat dark color="primary">
                <v-list>
                    <v-list-tile avatar>
                        <v-list-tile-avatar color="red">
                            <img v-if="$auth.user.avatarUrl" :src="$auth.user.avatarUrl">
                            <span v-else class="white--text headline">
                                {{ ($auth.user.name || '?').substr(0, 1) }}
                            </span>
                        </v-list-tile-avatar>
                        <v-list-tile-content>
                            <v-list-tile-title>
                                {{ $auth.user.name }}
                            </v-list-tile-title>
                            <v-list-tile-sub-title v-if="!$workspaces.empty">
                                {{ $workspaces.active.name }}
                                <v-menu bottom>
                                    <v-btn slot="activator" icon>
                                        <v-icon>arrow_drop_down</v-icon>
                                    </v-btn>
                                    <v-list>
                                        <v-list-tile
                                            v-for="(workspace, i) in $workspaces.all"
                                            v-if="workspace !== $workspaces.active"
                                            :key="i"
                                            @click="activateWorkspace(workspace)"
                                        >
                                            <v-list-tile-title>
                                                {{ workspace.name }}
                                            </v-list-tile-title>
                                        </v-list-tile>
                                        <v-list-tile @click="createWorkspace">
                                            <v-list-tile-title>
                                                New Workspace
                                            </v-list-tile-title>
                                        </v-list-tile>
                                    </v-list>
                                </v-menu>
                            </v-list-tile-sub-title>
                        </v-list-tile-content>

                        <v-list-tile-action>
                            <v-menu bottom left>
                                <v-btn
                                    slot="activator"
                                    dark
                                    icon
                                >
                                    <v-icon>more_vert</v-icon>
                                </v-btn>

                                <v-list>
                                    <v-list-tile @click="$auth.logout()">
                                        <v-list-tile-title>Logout</v-list-tile-title>
                                    </v-list-tile>
                                </v-list>
                            </v-menu>
                        </v-list-tile-action>
                    </v-list-tile>
                </v-list>
            </v-toolbar>
            <v-list v-if="!$workspaces.empty">
                <v-list-tile
                    v-for="(list, i) in $workspaces.active.lists"
                    :key="i"
                    @click="activateList(list)"
                >
                    <v-list-tile-title>
                        {{ list.name }}
                    </v-list-tile-title>
                </v-list-tile>
                <v-list-tile @click="createWorkspaceList">
                    <v-list-tile-title>
                        Add List
                    </v-list-tile-title>
                </v-list-tile>
            </v-list>
        </v-navigation-drawer>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';

import List from '@/models/List';
import Workspace from '@/models/Workspace';

export default Vue.extend({
    data() {
        return {
            collapsed: false,
        };
    },
    created() {
        this.collapsed = this.$ui.mobile;
    },
    methods: {
        toggleMenu(visible: boolean) {
            this.collapsed = !visible;
        },
        createWorkspace() {
            this.$ui.openDialog(
                () => import('@/dialogs/CreateWorkspace.vue')
            );
        },
        createWorkspaceList() {
            this.$ui.openDialog(
                () => import('@/dialogs/CreateWorkspaceList.vue')
            )
                .then(list => (this.$workspaces.active as Workspace).setActiveList(list));
        },
        activateWorkspace(workspace: Workspace) {
            this.$ui.wrapAsyncOperation(
                this.$workspaces.setActiveWorkspace(workspace),
                `Loading ${workspace.name}...`
            );
        },
        activateList(list: List) {
            if (this.$workspaces.hasActive()) {
                this.$ui.wrapAsyncOperation(
                    this.$workspaces.setActiveList(list),
                    `Loading ${list.name}...`
                );
            }

            if (this.$ui.mobile) {
                this.collapsed = true;
            }
        },
    },
});
</script>
