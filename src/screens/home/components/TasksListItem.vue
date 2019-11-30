<template>
    <v-list-tile
        :class="{
            'pending': !task.completed,
            'completed': task.completed,
            'bg-grey-lighter': $tasks.active === task,
            'cursor-pointer': !task.saving,
        }"
        class="task-item"
    >
        <v-list-tile-action class="flex-no-shrink">
            <v-checkbox
                v-if="!task.saving"
                :input-value="task.completed"
                color="primary"
                @change="toggle"
            />
            <v-progress-circular
                v-else
                :color="$ui.styles.colors.jade"
                :indeterminate="true"
                :size="24"
                :width="3"
                style="margin-right: 8px"
            />
        </v-list-tile-action>

        <v-list-tile-content
            :class="{ 'opacity-50': task.saving }"
            class="flex flex-row align-center flex-grow"
            @click="focus"
        >
            <span class="truncate w-full" v-html="renderedName" />
        </v-list-tile-content>

        <v-list-tile-action
            v-if="task.dueAt"
            :class="{
                'text-red': !task.completed && $dayjs(task.dueAt).isBefore($dayjs(), 'day'),
                'text-blue': !task.completed && $dayjs(task.dueAt).isSame($dayjs(), 'day'),
            }"
            class="flex flex-row flex-no-shrink flex-no-grow align-center ml-2 text-base"
            @click="focus"
        >
            {{ renderedDueAt }}
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
        focus() {
            if (this.task.saving)
                return;

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
