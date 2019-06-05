<template>
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
</template>

<script lang="ts">
import Vue from 'vue';

import List from '@/models/soukai/List';
import Task from '@/models/soukai/Task';

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
