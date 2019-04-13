<template>
    <div>
        <v-toolbar
            :height="toolbarHeight"
            color="primary"
            app
            dark
        >
            <v-toolbar-side-icon
                title="Toggle navigation drawer"
                @click="collapsed = !collapsed"
            >
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
                            <span :title="userInfo" class="text-lg tablet:text-xl desktop:text-xl">
                                {{ $auth.user.name }}
                            </span>
                            <v-menu v-if="!$workspaces.empty" bottom>
                                <div
                                    v-ripple
                                    slot="activator"
                                    title="Change active workspace"
                                    class="opacity-75 flex items-center text-sm"
                                >
                                    <span>{{ $workspaces.active.name }}</span>
                                    <v-icon color="white">arrow_drop_down</v-icon>
                                </div>
                                <v-list>
                                    <v-list-tile
                                        v-for="(workspace, i) in inactiveWorkspaces"
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
                                title="Show options"
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
            <div
                :style="{
                    height: `calc(100vh - ${toolbarHeight}px)`
                }"
                class="flex flex-col"
            >
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
                <div v-else-if="!collapsed" class="p-4">
                    Welcome! Create a workspace to get started.
                </div>
                <div v-else class="p-4 text-center">
                    <a title="Show welcome message" @click="collapsed = false">👋</a>
                </div>
                <v-spacer />
                <div
                    :class="{
                        'justify-end': !collapsed,
                        'justify-center': collapsed,
                    }"
                    class="text-sm flex flex-no-grow items-center justify-end p-4"
                >
                    <a
                        href="https://github.com/noeldemartin/solid-focus"
                        target="_blank"
                        class="w-4 h-4 mr-1"
                        title="Visit project Github"
                    >
                        <svg
                            class="w-4 h-4 text-black opacity-50 fill-current hover:opacity-100"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 512 512"
                        >
                            <path
                                d="M255.968,5.329C114.624,5.329,0,120.401,0,262.353c0,113.536,73.344,209.856,175.104,243.872
                                c12.8,2.368,17.472-5.568,17.472-12.384c0-6.112-0.224-22.272-0.352-43.712c-71.2,15.52-86.24-34.464-86.24-34.464
                                c-11.616-29.696-28.416-37.6-28.416-37.6c-23.264-15.936,1.728-15.616,1.728-15.616c25.696,1.824,39.2,26.496,39.2,26.496
                                c22.848,39.264,59.936,27.936,74.528,21.344c2.304-16.608,8.928-27.936,16.256-34.368
                                c-56.832-6.496-116.608-28.544-116.608-127.008c0-28.064,9.984-51.008,26.368-68.992c-2.656-6.496-11.424-32.64,2.496-68
                                c0,0,21.504-6.912,70.4,26.336c20.416-5.696,42.304-8.544,64.096-8.64c21.728,0.128,43.648,2.944,64.096,8.672
                                c48.864-33.248,70.336-26.336,70.336-26.336c13.952,35.392,5.184,61.504,2.56,68c16.416,17.984,26.304,40.928,26.304,68.992
                                c0,98.72-59.84,120.448-116.864,126.816c9.184,7.936,17.376,23.616,17.376,47.584c0,34.368-0.32,62.08-0.32,70.496
                                c0,6.88,4.608,14.88,17.6,12.352C438.72,472.145,512,375.857,512,262.353C512,120.401,397.376,5.329,255.968,5.329z"
                            />
                        </svg>
                    </a>
                    <span v-if="!collapsed"> | Version {{ $config.version }}</span>
                </div>
            </div>
        </v-navigation-drawer>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';

import List from '@/models/soukai/List';
import SolidUser from '@/models/users/SolidUser';
import Workspace from '@/models/soukai/Workspace';

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
        inactiveWorkspaces(): Workspace[] {
            return this.$workspaces.all
                .filter((workspace: Workspace) => workspace !== this.$workspaces.active);
        },
        userInfo(): string | void {
            // TODO this should be moved to a dedicated section with more information
            // about the user.
            if (this.$auth.user instanceof SolidUser) {
                return 'WebID: ' + this.$auth.user.id;
            }
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
            this.$ui.openDialog(() => import('@/dialogs/CreateWorkspace.vue'));
        },
        createWorkspaceList() {
            this.$ui.openDialog(() => import('@/dialogs/CreateWorkspaceList.vue'));
        },
        activateWorkspace(workspace: Workspace) {
            if (!workspace.loaded) {
                this.$ui.wrapAsyncOperation(
                    this.$workspaces.setActiveWorkspace(workspace),
                    `Loading ${workspace.name} workspace...`
                );
            } else {
                this.$workspaces.setActiveWorkspace(workspace);
            }
        },
        activateList(list: List) {
            if (this.$workspaces.hasActive()) {
                if (!list.isRelationLoaded('tasks')) {
                    this.$ui.wrapAsyncOperation(
                        this.$workspaces.setActiveList(list),
                        `Loading ${list.name} list...`
                    );
                } else {
                    this.$workspaces.setActiveList(list);
                }
            }

            if (this.$ui.mobile) {
                this.collapsed = true;
            }
        },
    },
});
</script>
