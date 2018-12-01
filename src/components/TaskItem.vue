<template>
    <v-list-tile class="flex items-center">
        <v-checkbox
            :input-value="task.completed"
            class="p-0"
            @change="toggle()"
        />
        <span :class="{ 'line-through': task.completed }">
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
            // TODO loading & handle errors
            this.$workspaces.toggleTask(this.task);
        },
    },
});
</script>
