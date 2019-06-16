<template>
    <div class="flex flex-col flex-grow">
        <div class="p-4 overflow-y-auto">
            <h2>{{ task.name }}</h2>
        </div>

        <v-spacer />

        <div class="flex flex-row-reverse justify-between align-end">
            <div class="flex flex-col flex-no-grow align-end">
                <v-btn flat @click="$tasks.setEditing(true)">
                    Edit
                    <v-icon class="ml-2">edit</v-icon>
                </v-btn>
            </div>

            <v-btn :class="{ hidden: $ui.mobile }" icon @click="$emit('close')">
                <v-icon>chevron_right</v-icon>
            </v-btn>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';

import Task from '@/models/soukai/Task';

export default Vue.extend({
    props: {
        task: {
            type: Object as () => Task,
            required: true,
        },
    },
});
</script>
