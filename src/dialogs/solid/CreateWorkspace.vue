<template>
    <DialogForm
        :dialog="dialog"
        title="Create Workspace"
        submit-label="Create"
        @completed="createWorkspace"
    >
        <v-select
            v-model="storage"
            :items="$auth.user.storages"
            :rules="rules.storage"
            label="Storage"
        />
        <v-text-field
            v-model="name"
            :rules="rules.name"
            validate-on-blur
            label="Name"
        />
    </DialogForm>
</template>

<script lang="ts">
import Vue from 'vue';

import { ValidationRule } from 'vuetify';

import User from '@/models/solid/User';

import Workspaces from '@/services/solid/Workspaces';

import Dialog from '@/dialogs/Dialog';

import Validations from '@/utils/Validations';

interface Data {
    storage: string;
    name: string;
}

export default Vue.extend({
    mixins: [Dialog],
    data(): Data {
        return {
            storage: '',
            name: '',
        };
    },
    computed: {
        rules(): { [field: string]: ValidationRule[] } {
            return {
                storage: [
                    Validations.required,
                ],
                name: [
                    Validations.required,
                    Validations.maxLength(255),
                ],
            };
        },
    },
    created() {
        this.$auth.withUser((user: User) => {
            this.storage = user.storages[0];
        });
    },
    methods: {
        async createWorkspace() {
            const workspace = await this.$workspaces.create(this.storage, this.name);

            this.complete(workspace);
        },
    },
});
</script>
