<template>
    <DialogBase :dialog="dialog">
        <v-card-text class="text-xl">
            {{ message }}
        </v-card-text>
        <template v-slot:actions>
            <v-spacer />
            <v-btn flat @click="cancel">
                Cancel
            </v-btn>
            <v-btn flat color="primary" @click="confirm">
                {{ confirmLabel }}
            </v-btn>
        </template>
    </DialogBase>
</template>

<script lang="ts">
import Vue from 'vue';

import { Dialog } from '@/services/UI';

import DialogBase from '@/dialogs/DialogBase.vue';

export default Vue.extend({
    components: {
        DialogBase,
    },
    props: {
        dialog: {
            type: Object as () => Dialog,
            required: true,
        },
        message: {
            type: String,
            required: true,
        },
        confirmLabel: {
            type: String,
            default: 'Accept',
        },
    },
    methods: {
        confirm() {
            this.$ui.completeDialog(this.dialog.id, true);
        },
        cancel() {
            this.$ui.completeDialog(this.dialog.id, false);
        },
    },
});
</script>
