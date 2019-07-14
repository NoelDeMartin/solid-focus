<template>
    <div
        id="app-navigation-drawer"
        :class="{
            open: isOpen,
            closed: isClosed,
        }"
        class="bg-white z-20 overflow-hidden flex-no-shrink"
    >
        <div
            :style="{ height: $ui.toolbarHeight + 'px' }"
            class="bg-jade relative w-panel overflow-hidden"
        >
            <div class="block absolute pin-y pin-l w-panel max-w-full">
                <div class="p-2 h-full flex items-center">
                    <div
                        :style="{
                            height: `calc(${$ui.toolbarHeight}px - 1rem)`,
                            width: `calc(${$ui.toolbarHeight}px - 1rem)`,
                            'margin-left': centerAvatar
                                ? `${($ui.styles.widths['panel-collapsed'] - $ui.toolbarHeight) / 2}px`
                                : '0',
                            'margin-right': centerAvatar
                                ? `calc(${($ui.styles.widths['panel-collapsed'] - $ui.toolbarHeight) / 2}px + .5rem)`
                                : '.5rem',
                        }"
                        class="
                            bg-red rounded-full transition-all
                            flex items-center justify-center flex-no-grow flex-no-shrink
                        "
                    >
                        <img v-if="$auth.user.avatarUrl" :src="$auth.user.avatarUrl">
                        <span v-else class="white--text headline">
                            {{ ($auth.user.name || '?').substr(0, 1) }}
                        </span>
                    </div>
                    <div :style="{ width: $ui.styles.widths['panel'] + 'px' }" class="flex flex-row">
                        <div class="text-white flex-grow flex flex-col overflow-hidden">
                            <span :title="userInfo" class="text-lg tablet:text-xl desktop:text-xl">
                                {{ $auth.user.name }}
                            </span>
                            <v-menu v-if="!$workspaces.empty" bottom>
                                <div
                                    v-ripple
                                    slot="activator"
                                    title="Manage workspaces"
                                    class="opacity-75 flex items-center text-sm"
                                >
                                    <span class="truncate">{{ $workspaces.active.name }}</span>
                                    <v-icon color="white">arrow_drop_down</v-icon>
                                </div>
                                <v-list>
                                    <v-list-tile
                                        v-for="(workspace, i) in $workspaces.all"
                                        :key="i"
                                        @click="activateWorkspace(workspace)"
                                    >
                                        <v-list-tile-title>
                                            <strong v-if="workspace === $workspaces.active">
                                                {{ workspace.name }}
                                            </strong>
                                            <span v-else>
                                                {{ workspace.name }}
                                            </span>
                                        </v-list-tile-title>
                                        <v-list-tile-action class="reveal-on-hover justify-end">
                                            <v-btn
                                                title="Edit workspace"
                                                icon
                                                @click.stop="editWorkspace(workspace)"
                                            >
                                                <v-icon>edit</v-icon>
                                            </v-btn>
                                        </v-list-tile-action>
                                    </v-list-tile>
                                    <v-list-tile @click="createWorkspace">
                                        <v-list-tile-title>
                                            <v-icon class="mr-1">add_circle</v-icon>
                                            Create workspace
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
        </div>
        <div
            :style="{ height: `calc(100vh - ${$ui.toolbarHeight}px)` }"
            class="flex flex-col overflow-y-auto"
        >
            <v-list v-if="!$workspaces.empty">
                <v-list-tile
                    v-for="(list, i) in lists"
                    :key="i"
                    @click="activateList(list)"
                >
                    <v-list-tile-title>
                        <strong v-if="$workspaces.active.activeList === list">{{ list.name }}</strong>
                        <span v-else>{{ list.name }}</span>
                    </v-list-tile-title>
                    <v-list-tile-action v-if="list.editable" class="reveal-on-hover justify-end">
                        <v-btn
                            title="Edit list"
                            icon
                            @click.stop="editList(list)"
                        >
                            <v-icon>edit</v-icon>
                        </v-btn>
                    </v-list-tile-action>
                </v-list-tile>
                <v-list-tile @click="createWorkspaceList">
                    <v-list-tile-title class="flex" title="Create list">
                        <v-icon
                            :style="{
                                width: isClosed
                                    ? ($ui.styles.widths['panel-collapsed'] - 32) + 'px'
                                    : '24px',
                            }"
                            class="mr-2 transition-all flex-no-shrink"
                        >
                            add_circle
                        </v-icon>
                        <span>Create list</span>
                    </v-list-tile-title>
                </v-list-tile>
            </v-list>
            <div v-else-if="!isClosed" class="p-4 w-panel max-w-full">
                Welcome! Create a workspace to get started.
            </div>
            <div v-else class="p-4 text-center">
                <a title="Show welcome message" @click="$ui.setNavigationDrawerOpen(true)">👋</a>
            </div>
            <v-spacer />
            <div
                :class="{
                    'justify-end': isOpen,
                    'justify-center': isClosed,
                }"
                class="text-sm flex flex-no-grow items-center p-4 truncate"
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
                <span v-if="isOpen" class="truncate">| Version {{ $config.version }}</span>
            </div>
        </div>
        <AppNavigationOverlay
            :active="isOpen && $ui.mobile"
            @click="$ui.setNavigationDrawerOpen(false)"
        />
    </div>
</template>

<script lang="ts">
import Vue from 'vue';

import List from '@/models/soukai/List';
import SolidUser from '@/models/users/SolidUser';
import Workspace from '@/models/soukai/Workspace';

import AppNavigationOverlay from '@/components/AppNavigationOverlay.vue';

export default Vue.extend({
    components: {
        AppNavigationOverlay,
    },
    computed: {
        centerAvatar(): boolean {
            return this.isClosed && !this.$ui.mobile;
        },
        userInfo(): string | void {
            // TODO this should be moved to a dedicated section with more information
            // about the user
            if (this.$auth.user instanceof SolidUser) {
                return 'WebID: ' + this.$auth.user.id;
            }
        },
        isOpen(): boolean {
            return this.$ui.navigationDrawerOpen;
        },
        isClosed(): boolean {
            return !this.isOpen;
        },
        lists(): List[] {
            const activeWorkspace = this.$workspaces.active;

            return activeWorkspace
                ? [
                    activeWorkspace.inbox,
                    ...(activeWorkspace.lists || []),
                ]
                : [];
        },
    },
    created() {
        this.$ui.setNavigationDrawerOpen(!this.$ui.mobile);
    },
    methods: {
        createWorkspace() {
            this.$ui.openDialog(() => import('@/dialogs/WorkspaceForm.vue'));
        },
        createWorkspaceList() {
            this.$ui.openDialog(() => import('@/dialogs/ListForm.vue'));
        },
        async activateWorkspace(workspace: Workspace) {
            if (!workspace.isRelationLoaded('lists')) {
                await this.$ui.wrapAsyncOperation(
                    workspace.loadRelation('lists'),
                    `Loading ${workspace.name}...`,
                );

                // TODO this could be done automatically in Soukai
                for (const list of workspace.lists!) {
                    list.setRelationModels('workspace', workspace);
                }
            }

            if (!workspace.activeList.isRelationLoaded('tasks')) {
                await this.$ui.wrapAsyncOperation(
                    workspace.activeList.loadRelation('tasks'),
                    `Loading ${workspace.activeList.name}...`,
                );
            }

            this.$workspaces.setActive(workspace);
        },
        async activateList(list: List) {
            if (!list.isRelationLoaded('tasks')) {
                await this.$ui.wrapAsyncOperation(
                    list.loadRelation('tasks'),
                    `Loading ${list.name}...`,
                );
            }

            this.$workspaces.active!.setActiveList(list);

            if (this.$ui.mobile) {
                this.$ui.setNavigationDrawerOpen(true);
            }
        },
        editWorkspace(workspace: Workspace) {
            this.$ui.openDialog(
                () => import('@/dialogs/WorkspaceForm.vue'),
                { workspace },
            );
        },
        editList(list: List) {
            this.$ui.openDialog(
                () => import('@/dialogs/ListForm.vue'),
                { list },
            );
        },
    },
});
</script>

<style lang="scss">
$navigation-drawer-width: config('width.panel');
$navigation-drawer-collapsed-width: config('width.panel-collapsed');

#app-navigation-drawer {
    position: relative;
    width: $navigation-drawer-width;
    max-width: 90vw;

    transition: width .3s, margin-left .3s;

    &::after {
        content: " ";
        position: absolute;
        background-color: config('colors.border-overlay');
        width: 1px;
        right: 0;
        top: 0;
        bottom: 0;
    }

    .layout-desktop &.closed,
    .layout-tablet &.closed {
        width: $navigation-drawer-collapsed-width;
    }

    .layout-mobile & {
        position: fixed;
        top: 0;
        left: 0;
        bottom: 0;
        margin-left: 0;

        &.closed {
            margin-left: calc(-1 * #{$navigation-drawer-width});
        }

    }

}
</style>
