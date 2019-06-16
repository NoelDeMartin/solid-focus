<template>
    <TasksManager v-if="!$workspaces.empty" />
    <div v-else class="flex flex-col items-center justify-center h-full">
        <h2 class="text-center">You don't have any workspace, create one!</h2>
        <v-btn
            fab
            dark
            color="primary"
            title="Create new workspace"
            @click="createWorkspace"
        >
            <v-icon dark>add</v-icon>
        </v-btn>
    </div>
</template>

<script lang="ts">
import Vue, { AsyncComponent } from 'vue';

import TasksManager from './components/TasksManager.vue';

export default Vue.extend({
    components: {
        TasksManager,
    },
    methods: {
        createWorkspace() {
            this.$ui.openDialog(
                () => import('@/dialogs/CreateWorkspace.vue')
            );
        },
    },
});
</script>
