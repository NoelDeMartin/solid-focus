<template>
    <div>
        <v-form @submit.prevent="create">
            <div class="flex">
                <v-text-field v-model="newTask" />
                <v-btn color="primary" @click="create">Add</v-btn>
            </div>
        </v-form>
        <v-list>
            <template v-for="(task, index) of pendingTasks">
                <TaskItem :key="task.id" :task="task" />
                <v-divider v-if="index !== list.length - 1" :key="`divider-${index}`" />
            </template>
            <v-list-tile v-if="pendingTasks.length === 0" class="text-grey-darker">
                No pending tasks
            </v-list-tile>
        </v-list>
        <template v-if="completedTasks.length > 0">
            <v-btn
                :flat="true"
                :block="true"
                color="primary"
                class="opacity-50"
                @click="showCompleted = !showCompleted"
            >
                {{ showCompleted ? 'Hide completed' : 'Show completed' }}
            </v-btn>
            <v-list v-if="showCompleted">
                <template v-for="(task, index) of completedTasks">
                    <TaskItem :key="task.id" :task="task" />
                    <v-divider v-if="index !== list.length - 1" :key="`divider-${index}`" />
                </template>
            </v-list>
        </template>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';

import Task from '@/models/Task';
import List from '@/models/List';

import TaskItem from '@/components/TaskItem.vue';

interface Data {
    newTask: string;
    showCompleted: boolean;
}

export default Vue.extend({
    components: {
        TaskItem,
    },
    props: {
        list: {
            type: Object as () => List,
            required: true,
        },
    },
    data(): Data {
        return {
            newTask: '',
            showCompleted: false,
        };
    },
    computed: {
        pendingTasks(): Task[] {
            return this.list.tasks.filter((task: Task) => !task.completed);
        },
        completedTasks(): Task[] {
            return this.list.tasks.filter((task: Task) => task.completed);
        },
    },
    methods: {
        async create() {
            if (this.newTask) {
                // TODO loading & handle errors
                await this.$workspaces.createTask(this.list, this.newTask);
                this.newTask = '';
            }
        },
    },
});
</script>
