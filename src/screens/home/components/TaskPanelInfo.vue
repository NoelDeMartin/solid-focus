<template>
    <div class="task-panel flex flex-col flex-grow">
        <div class="p-4 overflow-y-auto">
            <h2>{{ task.name }}</h2>
            <p class="text-sm italic mt-2">
                {{ task.description || 'No description' }}
            </p>
        </div>

        <v-spacer />

        <div class="flex flex-row-reverse justify-between align-end">
            <div class="actions flex flex-col flex-no-grow align-end">
                <v-btn
                    flat
                    small
                    color="blue lighten-1"
                    @click="edit"
                >
                    Edit
                    <v-icon class="ml-2">edit</v-icon>
                </v-btn>
                <v-btn
                    flat
                    small
                    color="red lighten-1"
                    @click="remove"
                >
                    Remove
                    <v-icon class="ml-2">delete</v-icon>
                </v-btn>
            </div>

            <v-btn :class="{ hidden: $ui.mobile }" icon @click="$emit('close')">
                <v-icon>chevron_right</v-icon>
            </v-btn>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';

import Task from '@/models/soukai/Task';

export default Vue.extend({
    props: {
        task: {
            type: Object as () => Task,
            required: true,
        },
    },
    methods: {
        edit() {
            this.$tasks.setEditing(true);
        },
        remove() {
            this.$ui.openDialog(
                () => import('@/dialogs/RemoveTask.vue'),
                { task: this.task },
            );
        },
    },
});
</script>

<style lang="scss">
.task-panel .actions .v-btn__content {
    justify-content: flex-end;
}
</style>
