<template>
    <div>
        <v-toolbar app dark>
            <v-toolbar-side-icon @click="collapsed = !collapsed">
                <v-icon>menu</v-icon>
            </v-toolbar-side-icon>
            <v-toolbar-title>Inbox</v-toolbar-title>
        </v-toolbar>
        <v-navigation-drawer
            :mini-variant="!$ui.mobile && collapsed"
            :value="!$ui.mobile || !collapsed"
            :temporary="$ui.mobile"
            app
            @input="input"
        >
            <v-toolbar flat dark>
                <v-list>
                    <v-list-tile avatar>
                        <v-list-tile-avatar color="red">
                            <img v-if="$auth.profile.avatarUrl" :src="$auth.profile.avatarUrl">
                            <span v-else class="white--text headline">
                                {{ ($auth.profile.name || '?').substr(0, 1) }}
                            </span>
                        </v-list-tile-avatar>
                        <v-list-tile-content>
                            <v-list-tile-title>
                                {{ $auth.profile.name }}
                            </v-list-tile-title>
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
                                    <v-list-tile @click="$auth.logout">
                                        <v-list-tile-title>Logout</v-list-tile-title>
                                    </v-list-tile>
                                </v-list>
                            </v-menu>
                        </v-list-tile-action>
                    </v-list-tile>
                </v-list>
            </v-toolbar>
        </v-navigation-drawer>
    </div>
</template>

<script>
export default {
    data() {
        return {
            collapsed: true,
        };
    },
    methods: {
        input(visible) {
            this.collapsed = !visible;
        },
    },
};
</script>
