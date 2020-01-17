<template>
    <DialogBase :dialog="dialog">
        <v-card-text class="text-xl">
            Are you sure that you want to delete the task <strong>{{ task.name }}</strong>?
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

import Task from '@/models/soukai/Task';

export default Vue.extend({
    components: {
        DialogBase,
    },
    props: {
        dialog: {
            type: Object as () => Dialog,
            required: true,
        },
        task: {
            type: Object as () => Task,
            required: true,
        },
    },
    methods: {
        async confirm() {
            await this.$ui.wrapAsyncOperation(this.deleteTask());

            this.$ui.completeDialog(this.dialog.id);
        },
        cancel() {
            this.$ui.completeDialog(this.dialog.id);
        },
        async deleteTask() {
            await this.task.delete();

            if (this.$tasks.active === this.task) {
                this.$tasks.setActive(null);
            }

            const activeListTasks = this.$workspaces.active!.activeList.tasks!;
            const index = activeListTasks.findIndex(task => task === this.task);

            if (index !== -1) {
                activeListTasks.splice(index, 1);
            }
        },
    },
});
</script>
