<template>
    <AppNavigationSidepanel :open="isOpen">
        <Freezable
            v-slot="{ task, editing }"
            :frozen-props="{
                task: $tasks.active,
                editing: $tasks.editing,
            }"
            :frozen="!$tasks.active"
            class="h-full flex flex-col"
        >
            <v-toolbar v-if="$ui.mobile" color="primary" dark>
                <v-btn icon @click="close">
                    <v-icon>arrow_back</v-icon>
                </v-btn>

                <v-toolbar-title>
                    Task details
                </v-toolbar-title>
            </v-toolbar>

            <TaskPanelForm v-if="editing" :task="task" />
            <TaskPanelInfo v-else :task="task" @close="close" />

        </Freezable>
    </AppNavigationSidepanel>
</template>

<script lang="ts">
import Vue from 'vue';

import Task from '@/models/soukai/Task';

import AppNavigationSidepanel from '@/components/AppNavigationSidepanel.vue';
import Freezable from '@/components/Freezable.vue';

import TaskPanelForm from './TaskPanelForm.vue';
import TaskPanelInfo from './TaskPanelInfo.vue';

export default Vue.extend({
    components: {
        AppNavigationSidepanel,
        Freezable,
        TaskPanelForm,
        TaskPanelInfo,
    },
    computed: {
        isOpen(): boolean {
            return this.$tasks.active !== null;
        },
        isClosed(): boolean {
            return !this.isOpen;
        },
    },
    methods: {
        close() {
            this.$tasks.setActive(null, false);
        },
    },
});
</script>
