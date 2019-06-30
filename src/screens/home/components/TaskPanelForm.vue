<template>
    <div class="flex flex-col flex-grow">
        <div class="m-4">
            <v-textarea
                v-model="name"
                :hide-details="true"
                :rows="1"
                placeholder="Title"
                class="p-0 m-0 ml-1"
                auto-grow
            />
        </div>

        <div class="mx-4 mb-4">
            <v-textarea
                v-model="description"
                :hide-details="true"
                :rows="1"
                prepend-icon="description"
                placeholder="Description"
                class="p-0"
                clearable
                auto-grow
            />
        </div>

        <div class="mx-4">
            <DatePickerInput
                v-model="dueAt"
                placeholder="Due date"
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

import DatePickerInput from '@/components/DatePickerInput.vue';

interface Data {
    name: string,
    description: string,
    dueAt: Date | null,
}

export default Vue.extend({
    components: {
        DatePickerInput,
    },
    props: {
        task: {
            type: Object as () => Task,
            required: true,
        },
    },
    data(): Data {
        return {
            name: '',
            description: '',
            dueAt: null,
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
            // TODO handle async errors
            this.task.update({
                name: this.name,
                description: this.description || undefined,
                dueAt: this.dueAt || undefined,
            });

            this.$tasks.setEditing(false);
        },
        cancel() {
            this.$tasks.setEditing(false);
        },
        updateValues() {
            this.name = this.task.name;
            this.description = this.task.description;
            this.dueAt = this.task.dueAt;
        },
    },
});
</script>
