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
                                title="Show actions menu"
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
            <AppInfo
                :show-version="isOpen"
                :class="{
                    'justify-end': isOpen,
                    'justify-center': isClosed,
                }"
                class="text-sm flex flex-no-grow items-center p-4 truncate"
            />
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

import AppInfo from '@/components/AppInfo.vue';
import AppNavigationOverlay from '@/components/AppNavigationOverlay.vue';

export default Vue.extend({
    components: {
        AppInfo,
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
            this.closeDrawerOnMobile();
        },
        createWorkspaceList() {
            this.$ui.openDialog(() => import('@/dialogs/ListForm.vue'));
            this.closeDrawerOnMobile();
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
            this.closeDrawerOnMobile();
        },
        async activateList(list: List) {
            if (!list.isRelationLoaded('tasks')) {
                await this.$ui.wrapAsyncOperation(
                    list.loadRelation('tasks'),
                    `Loading ${list.name}...`,
                );
            }

            this.$workspaces.active!.setActiveList(list);
            this.closeDrawerOnMobile();
        },
        editWorkspace(workspace: Workspace) {
            this.$ui.openDialog(
                () => import('@/dialogs/WorkspaceForm.vue'),
                { workspace },
            );

            this.closeDrawerOnMobile();
        },
        editList(list: List) {
            this.$ui.openDialog(
                () => import('@/dialogs/ListForm.vue'),
                { list },
            );

            this.closeDrawerOnMobile();
        },
        closeDrawerOnMobile() {
            if (this.$ui.mobile) {
                this.$ui.setNavigationDrawerOpen(false);
            }
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
