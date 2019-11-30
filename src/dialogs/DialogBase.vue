<template>
    <v-dialog
        :value="true"
        :persistent="persistent"
        :fullscreen="fullscreen"
        :max-width="$ui.mobile ? '80vw' : '60vw'"
        @input="close"
    >
        <v-card
            :color="color"
            :dark="dark"
            :class="{ 'flex flex-col': fullscreen }"
            class="dialog-base"
        >
            <v-toolbar v-if="title" :color="headerColor" dark>
                <v-btn icon dark @click="close">
                    <v-icon>close</v-icon>
                </v-btn>
                <v-toolbar-title :class="{ 'ml-0 text-xl': fullscreen }">
                    {{ title }}
                </v-toolbar-title>
                <v-spacer />
                <v-toolbar-items>
                    <slot name="toolbar-actions" />
                </v-toolbar-items>
            </v-toolbar>
            <slot />
            <v-spacer />
            <v-card-actions v-if="$slots.actions">
                <slot name="actions" />
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script lang="ts">
import Vue from 'vue';

import { Dialog } from '@/services/UI';

export default Vue.extend({
    props: {
        dialog: {
            type: Object as () => Dialog,
            required: true,
        },
        title: {
            type: String,
            default: null,
        },
        headerColor: {
            type: String,
            default: 'primary',
        },
        color: {
            type: String,
            default: null,
        },
        persistent: {
            type: Boolean,
            default: false,
        },
        dark: {
            type: Boolean,
            default: false,
        },
        fullscreen: {
            type: Boolean,
            default: false,
        },
    },
    methods: {
        close() {
            if (!this.persistent) {
                this.$ui.closeDialog(this.dialog.id);
            }
        },
    },
});
</script>

<style lang="scss">
.dialog-base .v-toolbar__content {
    padding-right: 0;
}
</style>
