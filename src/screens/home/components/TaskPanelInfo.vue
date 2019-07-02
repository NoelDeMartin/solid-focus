<template>
    <div class="task-panel flex flex-col flex-grow">
        <div class="p-4 overflow-y-auto">
            <h2 v-html="renderedName" />
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

        <v-spacer />

        <div class="flex flex-row-reverse justify-between align-end">
            <div class="actions flex flex-col flex-no-grow align-end">
                <v-btn
                    flat
                    small
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
    computed: {
        renderedName(): string {
            const html = this.$marked(this.task.name.trim());

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
