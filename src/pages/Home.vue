<template>
    <div class="p-4 h-full">
        <TasksManager
            v-if="!$workspaces.empty"
            :list="$workspaces.active.activeList"
        />
        <div v-else class="flex flex-col items-center justify-center h-full">
            <h2 class="text-center">You don't have any workspace, create one!</h2>
            <v-btn
                fab
                dark
                color="primary"
                @click="createWorkspace"
            >
                <v-icon dark>add</v-icon>
            </v-btn>
        </div>
    </div>
</template>

<script lang="ts">
import Vue, { AsyncComponent } from 'vue';

import TasksManager from '@/components/TasksManager.vue';

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
