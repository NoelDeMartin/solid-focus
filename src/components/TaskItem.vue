<template>
    <v-list-tile
        :class="{
            'pending': !task.completed,
            'completed': task.completed,
        }"
        class="task-item"
    >
        <div class="checkbox" @click="toggle()">
            <v-icon v-if="task.completed" class="icon pending">undo</v-icon>
            <v-icon v-else class="icon pending">check_box_outline_blank</v-icon>
            <v-icon class="icon completed">done</v-icon>
        </div>
        <span class="label">
            {{ task.name }}
        </span>
    </v-list-tile>
</template>

<script lang="ts">
import Vue from 'vue';

import Task from '@/models/Task';

export default Vue.extend({
    props: {
        task: {
            type: Object as () => Task,
            required: true,
        },
    },
    methods: {
        toggle() {
            this.$ui.wrapAsyncOperation(
                this.$workspaces.toggleTask(this.task),
                'Toggling task...',
            );
        },
    },
});
</script>

<style lang="scss">
    $task-checkbox-width: 48px;
    $task-checkbox-hover-background-color: config('colors.grey-lighter');
    $task-pending-checkbox-icon-color: config('colors.grey');
    $task-completed-checkbox-icon-color: config('colors.green-light');
    $task-label-margin: config('margin.2');

    .task-item {

        .checkbox {
            width: $task-checkbox-width;
            position: absolute;
            top: 0;
            bottom: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            cursor: pointer;

            .icon.pending {
                color: $task-pending-checkbox-icon-color;
            }

            .icon.completed {
                color: $task-completed-checkbox-icon-color;
            }

            &:hover {
                background: $task-checkbox-hover-background-color;
            }

        }

        .label {
            margin-left: calc(#{$task-checkbox-width} + #{$task-label-margin});
        }

        &.completed .label {
            text-decoration: line-through;
        }

        &.completed .checkbox .icon.completed,
        &.completed .checkbox:hover .icon.pending,
        &.pending .checkbox .icon.pending,
        &.pending .checkbox:hover .icon.completed {
            display: flex !important;
        }

        &.completed .checkbox .icon.pending,
        &.completed .checkbox:hover .icon.completed,
        &.pending .checkbox .icon.completed,
        &.pending .checkbox:hover .icon.pending {
            display: none !important;
        }

        .layout-mobile & .v-list__tile {
            padding: 0;
        }

    }
</style>
