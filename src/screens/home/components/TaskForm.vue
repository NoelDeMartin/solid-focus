<template>
    <v-form class="p-4" @submit.prevent="create">
        <div class="flex">
            <v-text-field v-model="name" />
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
import Workspace from '@/models/soukai/Workspace';

interface Data {
    name: string;
}

export default Vue.extend({
    data(): Data {
        return {
            name: '',
        };
    },
    methods: {
        async create() {
            if (this.name) {
                const list = (this.$workspaces.active as Workspace).activeList;
                const task = new Task({ name: this.name });

                // TODO handle async errors
                task.save(list.url);

                list.setRelationModels('tasks', [...list.tasks || [], task]);

                this.name = '';
            }
        },
    },
});
</script>
