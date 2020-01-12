<template>
    <transition-group
        :duration="$ui.styles.transitions.normal"
        tag="v-list"
        class="tasks-list p-0"
        name="tasks-list-transition"
    >
        <template v-for="(task, index) of sortedTasks">
            <TasksListItem :key="task.id" :task="task" />
            <v-divider
                v-if="index !== tasks.length - 1"
                :key="`divider-${task.id}`"
            />
        </template>
    </transition-group>
</template>

<script lang="ts">
import Vue from 'vue';

import Task from '@/models/soukai/Task';

import TasksListItem from './TasksListItem.vue';

export default Vue.extend({
    components: {
        TasksListItem,
    },
    props: {
        tasks: {
            type: Array as () => Task[],
            required: true,
        },
    },
    computed: {
        sortedTasks(): Task[] {
            return this.tasks.slice(0).sort((a: Task, b: Task) => {
                if (a.starred || b.starred)
                    return a.starred ? -1 : 1;

                if (a.dueAt && b.dueAt)
                    return a.dueAt.getTime() - b.dueAt.getTime();

                if (a.dueAt || b.dueAt)
                    return a.dueAt ? -1 : 1;

                return b.createdAt.getTime() - a.createdAt.getTime();
            });
        },
    },
});
</script>

<style lang="scss">
$transition-duration: config('transitions.normal');

.tasks-list > * {
    overflow: hidden;
    transition: height $transition-duration !important;
}

.tasks-list-transition-move {
    transition: transform $transition-duration !important;
}

.tasks-list-transition-enter,
.tasks-list-transition-leave-to {
    height: 0 !important;
}
</style>
