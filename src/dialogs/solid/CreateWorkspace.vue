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

import User from '@/models/users/User';
import SolidUser from '@/models/users/SolidUser';

import { Dialog } from '@/services/UI';

import DialogForm from '@/dialogs/DialogForm.vue';

import Validations from '@/utils/Validations';

interface Data {
    storage: string;
    name: string;
}

export default Vue.extend({
    components: {
        DialogForm,
    },
    props: {
        dialog: {
            type: Object as () => Dialog,
            required: true,
        },
    },
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
            this.storage = (user as SolidUser).storages[0];
        });
    },
    methods: {
        async createWorkspace() {
            const workspace = await this.$workspaces.createWorkspace(this.storage, this.name);

            this.$ui.completeDialog(this.dialog.id, workspace);
        },
    },
});
</script>
