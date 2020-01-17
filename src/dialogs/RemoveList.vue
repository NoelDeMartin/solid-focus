<template>
    <DialogBase :dialog="dialog">
        <v-card-text class="text-xl">
            Are you sure that you want to delete the list <strong>{{ list.name }}</strong>? All
            tasks will also be deleted.
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

import List from '@/models/soukai/List';

export default Vue.extend({
    components: {
        DialogBase,
    },
    props: {
        dialog: {
            type: Object as () => Dialog,
            required: true,
        },
        list: {
            type: Object as () => List,
            required: true,
        },
    },
    methods: {
        async confirm() {
            await this.$ui.wrapAsyncOperation(this.removeList());

            this.$ui.completeDialog(this.dialog.id);
        },
        cancel() {
            this.$ui.completeDialog(this.dialog.id);
        },
        async removeList() {
            await this.list.delete();

            const workspace = this.list.workspace;

            if (!workspace.isRelationLoaded('lists')) {
                return;
            }

            const index = workspace.lists!.findIndex(list => list === this.list);

            if (index !== -1) {
                workspace.lists!.splice(index, 1);
                workspace.setActiveList(workspace.inbox);
            }
        },
    },
});
</script>
