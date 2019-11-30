<template>
    <div class="task-panel flex flex-col flex-grow">
        <div class="p-4 overflow-y-auto">
            <h2 v-if="false" v-html="renderedName" />

            <div v-else class="flex justify-between items-start">
                <h2 v-html="renderedName" />

                <v-menu bottom left>
                    <v-btn
                        slot="activator"
                        title="Show actions menu"
                        icon
                    >
                        <v-icon>more_vert</v-icon>
                    </v-btn>

                    <v-list>
                        <v-list-tile @click="edit">
                            <v-icon class="mr-2">edit</v-icon>
                            <v-list-tile-title>Edit</v-list-tile-title>
                        </v-list-tile>
                        <v-list-tile @click="remove">
                            <v-icon class="mr-2">delete</v-icon>
                            <v-list-tile-title>Remove</v-list-tile-title>
                        </v-list-tile>
                    </v-list>
                </v-menu>
            </div>
            <p
                :class="{
                    'text-red': task.dueAt && !task.completed && $dayjs(task.dueAt).isBefore($dayjs(), 'day'),
                    'text-blue': task.dueAt && !task.completed && $dayjs(task.dueAt).isSame($dayjs(), 'day'),
                }"
                class="flex text-base mt-2 text-right items-center"
            >
                <v-icon class="mr-2">event</v-icon>
                <span v-if="task.dueAt">{{ renderedDueAt }}</span>
                <span v-else>No due date</span>
            </p>
            <div class="flex text-base mt-2">
                <v-icon class="self-start mr-2">description</v-icon>
                <div v-html="$marked(task.description || 'No description')" />
            </div>
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
    computed: {
        renderedName(): string {
            const html = this.$marked(this.task.name || '');

            // Strip surrounding p tag
            return html.substring(3, html.length - 5);
        },
        renderedDueAt(): string {
            return this.$dayjs(this.task.dueAt).calendar(undefined, {
                sameDay: '[Today]',
                nextDay: '[Tomorrow]',
                nextWeek: 'dddd',
                lastDay: '[Yesterday]',
                lastWeek: '[Last] dddd',
                sameElse: 'DD/MM/YYYY',
            });
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
.task-panel {

    .description p:last-child {
        margin-bottom: 0;
    }

    .actions .v-btn__content {
        justify-content: flex-end;
    }

}
</style>
