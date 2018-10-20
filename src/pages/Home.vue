<template>
    <div class="p-4">
        <CreateWorkspace v-if="$workspaces.empty" />
        <template v-else>
            <v-form @submit.prevent="createTask">
                <div class="flex">
                    <v-text-field v-model="newTask" />
                    <v-btn color="primary" @click="createTask">Add</v-btn>
                </div>
            </v-form>
            <v-list>
                <template v-for="(task, index) of tasks">
                    <v-list-tile :key="index">
                        {{ task }}
                    </v-list-tile>
                    <v-divider v-if="index !== tasks.length -1" :key="`divider-${index}`" />
                </template>
                <v-list-tile v-if="tasks.length === 0" class="text-grey-darker">
                    No tasks
                </v-list-tile>
            </v-list>
        </template>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';

import CreateWorkspace from '@/components/forms/CreateWorkspace.vue';

interface ComponentData {
    newTask: string;
    tasks: string[];
}

export default Vue.extend({
    components: {
        CreateWorkspace,
    },
    data(): ComponentData {
        return {
            newTask: '',
            tasks: [],
        };
    },
    methods: {
        createTask() {
            if (this.newTask) {
                this.tasks.push(this.newTask);
                this.newTask = '';
            }
        },
    },
});
</script>
