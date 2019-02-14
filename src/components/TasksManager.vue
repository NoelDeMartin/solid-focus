<template>
    <div>
        <v-form class="p-4" @submit.prevent="create">
            <div class="flex">
                <v-text-field v-model="newTask" />
                <v-btn color="primary" @click="create">Add</v-btn>
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

import Task from '@/models/Task';
import List from '@/models/List';

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
                try {
                    await this.$workspaces.createTask(this.list, this.newTask);
                } catch (e) {
                    this.$ui.showError(e);

                    // TODO delete task from local store
                }

                this.newTask = '';
            }
        },
    },
});
</script>
