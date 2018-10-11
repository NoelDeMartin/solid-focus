<template>
    <div class="bg-background w-screen h-screen flex flex-col items-center justify-center">
        <div class="fixed pin-r pin-t m-4">
            <a @click="$auth.logout()">Logout</a>
        </div>
        <h1 class="text-4xl">Focus 省</h1>
        <v-form class="w-4/5" @submit.prevent="createTask">
            <div class="flex">
                <v-text-field v-model="newTask" />
                <v-btn color="primary" @click="createTask">Add</v-btn>
            </div>
        </v-form>
        <v-list class="w-4/5">
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
    </div>
</template>

<script lang="ts">
import Vue from 'vue';

interface ComponentData {
    newTask: string;
    tasks: string[];
}

export default Vue.extend({
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
