<template>
    <div>
        <TaskForm />
        <TasksList :tasks="pendingTasks" />
        <div v-if="pendingTasks.length === 0" class="text-grey-darker text-center">
            Congratulations, you don't have any pending tasks!
        </div>

        <template v-if="completedTasks.length > 0">
            <v-btn
                :flat="true"
                :block="true"
                color="primary"
                class="opacity-50 m-0"
                @click="showCompleted = !showCompleted"
            >
                {{ showCompleted ? 'Hide completed' : 'Show completed' }}
            </v-btn>
            <v-slide-y-transition>
                <TasksList v-if="showCompleted" :tasks="completedTasks" />
            </v-slide-y-transition>
        </template>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';

import List from '@/models/soukai/List';
import Task from '@/models/soukai/Task';
import Workspace from '@/models/soukai/Workspace';

import TaskForm from './TaskForm.vue';
import TasksList from './TasksList.vue';

interface Data {
    showCompleted: boolean;
}

export default Vue.extend({
    components: {
        TaskForm,
        TasksList,
    },
    data(): Data {
        return {
            showCompleted: false,
        };
    },
    computed: {
        tasks(): Task[] {
            return (this.$workspaces.active as Workspace).activeList.tasks || [];
        },
        pendingTasks(): Task[] {
            return this.tasks.filter((task: Task) => !task.completed);
        },
        completedTasks(): Task[] {
            return this.tasks.filter((task: Task) => task.completed);
        },
    },
});
</script>
