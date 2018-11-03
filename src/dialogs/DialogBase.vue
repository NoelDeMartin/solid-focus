<template>
    <v-dialog :value="true" max-width="60vw" @input="close">
        <v-card>
            <v-toolbar v-if="title" dark color="primary">
                <v-btn icon dark @click="close">
                    <v-icon>close</v-icon>
                </v-btn>
                <v-toolbar-title>{{ title }}</v-toolbar-title>
            </v-toolbar>
            <slot />
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
        title: {
            type: String,
            default: null,
        },
        dialog: {
            type: Object as () => Dialog,
            required: true,
        },
    },
    methods: {
        close() {
            this.$ui.closeDialog(this.dialog.id);
        },
    },
});
</script>
