<template>
    <div class="flex flex-col flex-grow">
        <div class="m-4">
            <v-textarea
                ref="name"
                v-model="name"
                :hide-details="true"
                :rows="1"
                placeholder="Title"
                class="p-0 m-0 ml-1"
                auto-grow
            />
        </div>

        <div class="mx-4">
            <DatePickerInput
                ref="dueAt"
                v-model="dueAt"
                placeholder="Due date"
            />
        </div>

        <div class="mx-4 mb-4">
            <v-textarea
                ref="description"
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

import AsyncOperation from '@/utils/AsyncOperation';
import EventBus from '@/utils/EventBus';

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
    computed: {
        focusEventListener(): Function {
            return (field: string) => (this.$refs[field] as any).focus();
        },
    },
    watch: {
        task() {
            this.updateValues();
        },
    },
    created() {
        this.updateValues();
        EventBus.on('focus', this.focusEventListener);
    },
    destroyed() {
        EventBus.off('focus', this.focusEventListener);
    },
    methods: {
        async save() {
            const operation = new AsyncOperation();
            const originalAttributes: any = {
                name: this.task.name,
                description: this.task.description,
                dueAt: this.task.dueAt,
            };

            this.$tasks.setEditing(false);

            try {
                operation.start();

                await this.task.update({
                    name: this.name,
                    description: this.description || undefined,
                    dueAt: this.dueAt || undefined,
                });

                operation.complete();
            } catch (error) {
                operation.fail(error);

                // TODO implement this.task.setAttributes(originalAttributes); in soukai
                for (const attribute in originalAttributes) {
                    this.task.setAttribute(attribute, originalAttributes[attribute]);
                }
            }
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
