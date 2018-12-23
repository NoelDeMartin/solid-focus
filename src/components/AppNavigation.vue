<template>
    <div>
        <v-toolbar
            :height="toolbarHeight"
            color="primary"
            app
            dark
        >
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
            :mini-variant-width="collapsedDrawerWidth"
            :value="!$ui.mobile || !collapsed"
            :temporary="$ui.mobile"
            app
            @input="toggleMenu"
        >
            <div
                :style="{ height: toolbarHeight + 'px' }"
                class="bg-jade relative overflow-hidden"
            >
                <div class="block absolute pin-y pin-l" style="width:300px">
                    <div class="p-2 h-full flex items-center">
                        <div
                            :style="{
                                height: `calc(${toolbarHeight}px - 1rem)`,
                                width: `calc(${toolbarHeight}px - 1rem)`,
                                'margin-left': centerAvatar
                                    ? `${(collapsedDrawerWidth - toolbarHeight) / 2}px`
                                    : '0',
                                'margin-right': centerAvatar
                                    ? `calc(${(collapsedDrawerWidth - toolbarHeight) / 2}px + .5rem)`
                                    : '.5rem',
                            }"
                            class="
                                bg-red rounded-full transition-all
                                flex items-center justify-center flex-no-grow
                            "
                        >
                            <img v-if="$auth.user.avatarUrl" :src="$auth.user.avatarUrl">
                            <span v-else class="white--text headline">
                                {{ ($auth.user.name || '?').substr(0, 1) }}
                            </span>
                        </div>
                        <div class="text-white flex-grow flex flex-col">
                            <span class="text-lg tablet:text-xl desktop:text-xl">
                                {{ $auth.user.name }}
                            </span>
                            <v-menu bottom>
                                <div
                                    v-ripple
                                    slot="activator"
                                    class="opacity-75 flex items-center text-sm"
                                >
                                    <span>{{ $workspaces.active.name }}</span>
                                    <v-icon color="white">arrow_drop_down</v-icon>
                                </div>
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
                        </div>
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
                    </div>
                </div>
            </div>
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

import { Layout } from '@/services/UI';

export default Vue.extend({
    data() {
        return {
            collapsed: false,
        };
    },
    computed: {
        toolbarHeight(): number {
            switch (this.$ui.layout) {
                case Layout.Mobile:
                    return 56;
                default:
                    return 64;
            }
        },
        collapsedDrawerWidth(): number {
            return 80;
        },
        centerAvatar(): boolean {
            return this.collapsed && !this.$ui.mobile;
        },
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
