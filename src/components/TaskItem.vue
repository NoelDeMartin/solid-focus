<template>
    <v-list-tile
        :class="{
            'pending': !task.completed,
            'completed': task.completed,
        }"
        class="task-item"
    >
        <v-list-tile-action>
            <v-checkbox
                :input-value="task.completed"
                color="primary"
                @change="toggle"
            />
        </v-list-tile-action>
        <v-list-tile-content>
            {{ task.name }}
        </v-list-tile-content>
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
            // Allow the checkbox to be displayed as checked before the animation starts
            this.$nextTick(async () => {
                try {
                    await this.$workspaces.toggleTask(this.task);
                } catch (e) {
                    this.$ui.showError(e);

                    // TODO revert task status
                }
            });
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

        &.completed .v-list__tile__content {
            opacity: config('opacity.75');
        }

        .layout-mobile & .v-list__tile__action i {
            font-size: $mobile-min-size;
            margin-left: calc((24px - #{$mobile-min-size}) / 2);
        }

    }
</style>
