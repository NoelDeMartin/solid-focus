<template>
    <div>
        <v-form class="p-4" @submit.prevent="create">
            <div class="flex">
                <v-text-field v-model="newTask" />
                <v-btn
                    title="Create new task"
                    color="primary"
                    @click="create"
                >
                    Add
                </v-btn>
            </div>
        </v-form>
        <VerticalSlide tag="v-list" class="p-0">
            <template v-for="(task, index) of pendingTasks">
                <TaskItem :key="task.id" :task="task" />
                <v-divider
                    v-if="index !== pendingTasks.length - 1"
                    :key="`divider-${task.id}`"
                />
            </template>
        </VerticalSlide>
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
                <VerticalSlide v-if="showCompleted" tag="v-list" class="p-0">
                    <template v-for="(task, index) of completedTasks">
                        <TaskItem :key="task.id" :task="task" />
                        <v-divider
                            v-if="index !== completedTasks.length - 1"
                            :key="`divider-${task.id}`"
                        />
                    </template>
                </VerticalSlide>
            </v-slide-y-transition>
        </template>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';

import List from '@/models/soukai/List';
import Task from '@/models/soukai/Task';

import TaskItem from '@/components/TaskItem.vue';
import VerticalSlide from '@/components/transitions/VerticalSlide.vue';

interface Data {
    newTask: string;
    showCompleted: boolean;
}

export default Vue.extend({
    components: {
        TaskItem,
        VerticalSlide,
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
        tasks(): Task[] {
            return this.list.tasks || [];
        },
        pendingTasks(): Task[] {
            return this.tasks.filter((task: Task) => !task.completed);
        },
        completedTasks(): Task[] {
            return this.tasks.filter((task: Task) => task.completed);
        },
    },
    methods: {
        async create() {
            if (this.newTask) {
                const task = new Task({ name: this.newTask });

                // TODO handle async errors
                task.save(this.list.url);

                this.list.setRelationModels('tasks', [...this.list.tasks || [], task]);

                this.newTask = '';
            }
        },
    },
});
</script>
