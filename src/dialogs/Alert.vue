<template>
    <DialogBase :dialog="dialog" :title="title" :header-color="type">
        <v-card-text class="text-xl">
            {{ message }}
        </v-card-text>
        <template v-slot:actions>
            <v-spacer />
            <v-btn :color="type" flat @click="close">
                OK
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
        title: {
            type: String,
            default: null,
        },
        message: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            default: null,
        },
    },
    methods: {
        close() {
            this.$ui.completeDialog(this.dialog.id);
        },
    },
});
</script>
