<template>
    <div class="task-panel flex flex-col flex-grow">
        <div class="flex flex-col p-4 overflow-y-auto">
            <div class="flex flex-no-grow justify-between items-start">
                <ClickableArea class="p-2 -mt-2 -ml-1 flex-grow text-left" @click="edit('name')">
                    <h2 v-html="renderedName" />
                </ClickableArea>

                <v-btn
                    :class="{ 'opacity-50': !task.starred }"
                    :color="task.starred ? 'primary' : 'grey'"
                    class="-mt-1 -mr-1"
                    icon
                    flat
                    @click="toggleStarred"
                >
                    <v-icon v-if="task.starred">star</v-icon>
                    <v-icon v-else>star_outline</v-icon>
                </v-btn>
            </div>

            <div class="group flex flex-no-grow">
                <ClickableArea
                    :class="{
                        'text-red': task.dueAt && !task.completed && $dayjs(task.dueAt).isBefore($dayjs(), 'day'),
                        'text-blue': task.dueAt && !task.completed && $dayjs(task.dueAt).isSame($dayjs(), 'day'),
                    }"
                    class="p-2 text-left flex flex-grow text-base items-center"
                    @click="editDueAt"
                >
                    <v-icon class="mr-2">event</v-icon>
                    <span v-if="task.dueAt">{{ renderedDueAt }}</span>
                    <span v-else>No due date</span>
                </ClickableArea>
                <v-btn
                    v-if="task.dueAt"
                    class="hidden m-0 group-hover:flex"
                    icon
                    flat
                    @click="updateDueAt(null)"
                >
                    <v-icon>close</v-icon>
                </v-btn>
            </div>

            <div v-if="task.description" class="group description flex flex-no-grow text-base p-2 relative">
                <v-icon class="flex flex-no-grow self-start mr-2 group-hover:hidden">description</v-icon>
                <v-btn
                    class="hidden group-hover:flex"
                    icon
                    flat
                    @click="edit('description')"
                >
                    <v-icon>edit</v-icon>
                </v-btn>
                <div v-html="$options.filters.markdown(task.description || 'No description')" />
            </div>

            <ClickableArea v-else class="p-2 flex flex-no-grow text-base text-left" @click="edit('description')">
                <v-icon class="self-start mr-2">description</v-icon>
                <div v-html="$options.filters.markdown(task.description || 'No description')" />
            </ClickableArea>
        </div>

        <v-spacer />

        <div class="flex flex-no-grow justify-between items-center">
            <v-btn :class="{ hidden: $ui.mobile }" icon @click="$emit('close')">
                <v-icon>chevron_right</v-icon>
            </v-btn>

            <span :class="{ 'mb-2': $ui.mobile }" class="text-sm flex-grow text-center opacity-75">
                Created on {{ $dayjs(task.createdAt).format('MMMM DD, YYYY') }}
            </span>

            <v-btn
                :class="{ hidden: $ui.mobile }"
                title="Delete task"
                icon
                @click="remove"
            >
                <v-icon>delete</v-icon>
            </v-btn>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';

import ClickableArea from '@/components/ClickableArea.vue';
import EventBus from '@/utils/EventBus';
import Task from '@/models/soukai/Task';

export default Vue.extend({
    components: {
        ClickableArea,
    },
    props: {
        task: {
            type: Object as () => Task,
            required: true,
        },
    },
    computed: {
        renderedName(): string {
            const html = this.$options.filters!.markdown(this.task.name || '');

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
        async editDueAt() {
            try {
                const date = await this.$ui.openDialog(
                    () => import('@/dialogs/DatePicker.vue'),
                    { date: this.task.dueAt },
                );

                await this.updateDueAt(date);
            } catch (error) {
                // dialog cancelled, nothing to do here
            }
        },
        async updateDueAt(date: Date | null) {
            await this.$ui.updateModel(
                this.task,
                task => task.update({ dueAt: date }),
                ['dueAt'],
            );
        },
        async edit(field: string) {
            this.$tasks.setEditing(true);

            await this.$nextTick();

            EventBus.emit('focus', field);
        },
        async toggleStarred() {
            await this.$ui.updateModel(
                this.task,
                task => task.toggleStarred(),
                ['priority'],
            );
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

    .description button {
        margin-left: -6px;
        margin-right: 2px;
        margin-top: -6px;
    }

    button p:last-child {
        margin-bottom: 0;
    }

}
</style>
