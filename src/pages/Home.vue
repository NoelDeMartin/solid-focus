<template>
    <div class="p-4">
        <component v-if="form" :is="form" @completed="form = null"/>
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
import Vue, { AsyncComponent } from 'vue';

import CreateWorkspace from '@/components/forms/solid/CreateWorkspace.vue';

import EventBus from '@/utils/EventBus';

interface Data {
    newTask: string;
    tasks: string[];
    form: AsyncComponent | null,
    _listener?: EventListener;
}

export default Vue.extend({
    components: {
        CreateWorkspace,
    },
    data(): Data {
        return {
            newTask: '',
            tasks: [],
            form: null,
        };
    },
    created() {
        if (this.$workspaces.empty) {
            this.form = () => import('@/components/forms/solid/CreateWorkspace.vue');
        }

        EventBus.on('create-workspace', this._listener = () => {
            this.form = () => import('@/components/forms/solid/CreateWorkspace.vue');
        });
    },
    destroyed() {
        if (this._listener) {
            EventBus.off('create-workspace', this._listener);
            delete this._listener;
        }
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
