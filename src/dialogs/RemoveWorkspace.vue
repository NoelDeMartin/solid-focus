<template>
    <DialogBase :dialog="dialog">
        <v-card-text class="text-xl">
            Are you sure that you want to delete the workspace <strong>{{ workspace.name }}</strong>? All
            tasks and lists will also be deleted.
        </v-card-text>
        <template v-slot:actions>
            <v-spacer />
            <v-btn flat @click="cancel">
                Cancel
            </v-btn>
            <v-btn flat color="red lighten-1" @click="confirm">
                Delete
            </v-btn>
        </template>
    </DialogBase>
</template>

<script lang="ts">
import Vue from 'vue';

import { Dialog } from '@/services/UI';

import DialogBase from '@/dialogs/DialogBase.vue';

import Workspace from '@/models/soukai/Workspace';

export default Vue.extend({
    components: {
        DialogBase,
    },
    props: {
        dialog: {
            type: Object as () => Dialog,
            required: true,
        },
        workspace: {
            type: Object as () => Workspace,
            required: true,
        },
    },
    methods: {
        async confirm() {
            await this.$ui.wrapAsyncOperation(this.removeWorkspace());

            this.$ui.completeDialog(this.dialog.id);
        },
        cancel() {
            this.$ui.completeDialog(this.dialog.id);
        },
        async removeWorkspace() {
            await this.workspace.delete();

            this.$workspaces.remove(this.workspace);
        },
    },
});
</script>
