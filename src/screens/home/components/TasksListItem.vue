<template>
    <v-list-tile
        :class="{
            'pending': !task.completed,
            'completed': task.completed,
            'bg-grey-lighter': $tasks.active === task,
        }"
        class="task-item cursor-pointer"
        @click="focus"
    >
        <v-list-tile-action class="flex-no-shrink">
            <v-checkbox
                :input-value="task.completed"
                color="primary"
                @change="toggle"
            />
        </v-list-tile-action>
        <v-list-tile-content class="flex flex-row align-center flex-grow">
            <span class="truncate w-full">{{ task.name }}</span>
        </v-list-tile-content>

        <v-list-tile-action
            v-if="!$ui.mobile"
            class="actions flex flex-row flex-no-shrink flex-no-grow align-center ml-2"
        >
            <v-btn
                title="Edit task"
                class="mr-2"
                icon
                @click.stop="remove"
            >
                <v-icon>delete</v-icon>
            </v-btn>
            <v-btn
                title="Edit task"
                icon
                @click.stop="edit"
            >
                <v-icon>edit</v-icon>
            </v-btn>
        </v-list-tile-action>
    </v-list-tile>
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
        focus() {
            this.$tasks.setActive(this.task);
        },
        toggle() {
            // Allow the checkbox to be displayed as checked before the animation starts
            this.$nextTick(async () => {
                this.task.toggle();

                // TODO handle async errors
                this.task.save();
            });
        },
        edit() {
            this.$tasks.setActive(this.task, true);
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
    // Minimum clickable area size in mobile devices
    $mobile-min-size: 32px;

    .task-item {
        height: 48px; // This is necessary for transitions to work correctly

        .v-list__tile__action {
            min-width: 0;
        }

        .v-list__tile__content {
            margin-left: config('margin.2');
        }

        .actions {
            display: none;
        }

        &:hover .actions {
            display: flex;
        }

        &.completed .v-list__tile__content {
            opacity: config('opacity.75');
        }

        .layout-mobile & .v-list__tile__action i {
            font-size: $mobile-min-size;
            margin-left: calc((24px - #{$mobile-min-size}) / 2);
        }

    }
</style>
