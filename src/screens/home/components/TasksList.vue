<template>
    <VerticalSlide tag="v-list" class="p-0">
        <template v-for="(task, index) of tasks">
            <TasksListItem :key="task.id" :task="task" />
            <v-divider
                v-if="index !== tasks.length - 1"
                :key="`divider-${task.id}`"
            />
        </template>
    </VerticalSlide>
</template>

<script lang="ts">
import Vue from 'vue';

import Task from '@/models/soukai/Task';

import VerticalSlide from '@/components/transitions/VerticalSlide.vue';

import TasksListItem from './TasksListItem.vue';

export default Vue.extend({
    components: {
        TasksListItem,
        VerticalSlide,
    },
    props: {
        tasks: {
            type: Array as () => Task[],
            required: true,
        },
    },
});
</script>
