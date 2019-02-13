<template>
    <div>
        <v-form class="p-4" @submit.prevent="create">
            <div class="flex">
                <v-text-field v-model="newTask" />
                <v-btn color="primary" @click="create">Add</v-btn>
            </div>
        </v-form>
        <v-slide-x-transition
            class="p-0"
            tag="v-list"
            group
        >
            <template v-for="(task, index) of pendingTasks">
                <TaskItem :key="task.id" :task="task" />
                <v-divider
                    v-if="index !== pendingTasks.length - 1"
                    :key="`divider-${task.id}`"
                />
            </template>
            <v-list-tile v-if="pendingTasks.length === 0" class="text-grey-darker">
                No pending tasks
            </v-list-tile>
        </v-slide-x-transition>
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
            <v-slide-x-transition
                v-if="showCompleted"
                class="p-0"
                tag="v-list"
                group
            >
                <template v-for="(task, index) of completedTasks">
                    <TaskItem :key="task.id" :task="task" />
                    <v-divider
                        v-if="index !== completedTasks.length - 1"
                        :key="`divider-${task.id}`"
                    />
                </template>
            </v-slide-x-transition>
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
                await this.$ui.wrapAsyncOperation(
                    this.$workspaces.createTask(this.list, this.newTask),
                    'Creating task...',
                );
                this.newTask = '';
            }
        },
    },
});
</script>
