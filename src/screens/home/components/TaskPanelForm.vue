<template>
    <div class="flex flex-col flex-grow">
        <div class="p-4">
            <v-textarea
                v-model="name"
                :hide-details="true"
                :rows="1"
                placeholder="Title"
                class="p-0 m-0 ml-1"
                auto-grow
            />
        </div>

        <v-spacer />

        <div class="flex flex-no-grow justify-end p-2 border-solid border-0 border-t border-grey-light bg-grey-lighter">
            <v-btn flat @click="cancel">
                Cancel
            </v-btn>

            <v-btn depressed color="primary" @click="save">
                Save
            </v-btn>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';

import Task from '@/models/soukai/Task';

interface Data {
    name: string,
}

export default Vue.extend({
    props: {
        task: {
            type: Object as () => Task,
            required: true,
        },
    },
    data(): Data {
        return {
            name: '',
        };
    },
    watch: {
        task() {
            this.updateValues();
        },
    },
    created() {
        this.updateValues();
    },
    methods: {
        save() {
            this.task.update({ name: this.name });

            // TODO handle async errors
            this.task.save();

            this.$tasks.setEditing(false);
        },
        cancel() {
            this.$tasks.setEditing(false);
        },
        updateValues() {
            this.name = this.task.name;
        },
    },
});
</script>
