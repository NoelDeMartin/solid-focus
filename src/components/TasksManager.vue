<template>
    <div>
        <v-form @submit.prevent="create">
            <div class="flex">
                <v-text-field v-model="newTask" />
                <v-btn color="primary" @click="create">Add</v-btn>
            </div>
        </v-form>
        <v-list>
            <template v-for="(task, index) of list.tasks">
                <v-list-tile :key="task.id" class="flex items-center">
                    <v-checkbox
                        :input-value="task.completed"
                        class="p-0"
                        @change="toggle(task)"
                    />
                    {{ task.name }}
                </v-list-tile>
                <v-divider v-if="index !== list.length - 1" :key="`divider-${index}`" />
            </template>
            <v-list-tile v-if="list.empty" class="text-grey-darker">
                No tasks
            </v-list-tile>
        </v-list>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';

import Task from '@/models/Task';
import List from '@/models/List';

interface Data {
    newTask: string;
}

export default Vue.extend({
    props: {
        list: {
            type: Object as () => List,
            required: true,
        },
    },
    data(): Data {
        return {
            newTask: '',
        };
    },
    methods: {
        async create() {
            if (this.newTask) {
                // TODO loading & handle errors
                await this.$workspaces.createTask(this.list, this.newTask);
                this.newTask = '';
            }
        },
        toggle(task: Task) {
            // TODO loading & handle errors
            this.$workspaces.toggleTask(task);
        },
    },
});
</script>
