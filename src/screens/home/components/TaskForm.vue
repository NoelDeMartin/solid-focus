<template>
    <v-form class="p-4" @submit.prevent="create">
        <div class="flex">
            <v-text-field
                :hide-details="true"
                v-model="name"
                class="mt-0 pt-0 self-center"
            />
            <v-btn
                :class="{ 'min-w-0': $ui.mobile }"
                title="Create new task"
                color="primary"
                class="text-field-append"
                depressed
                @click="create"
            >
                <v-icon v-if="$ui.mobile">add</v-icon>
                <span v-else>Add</span>
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
            if (!this.name)
                return;

            try {
                const activeList = this.$workspaces.active!.activeList;

                await activeList.createTask(this.consumeInput());
            } catch (error) {
                this.$ui.showError(error);
            }
        },
        consumeInput() {
            const name = this.name;

            this.name = '';

            return { name };
        },
    },
});
</script>
