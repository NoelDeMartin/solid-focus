<template>
    <DialogForm
        :dialog="dialog"
        title="Create Workspace List"
        submit-label="Create"
        @completed="createWorkspaceList"
    >
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

import { Dialog } from '@/services/UI';

import Workspace from '@/models/Workspace';

import DialogForm from '@/dialogs/DialogForm.vue';

import Validations from '@/utils/Validations';

interface Data {
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
            name: '',
        };
    },
    computed: {
        rules(): { [field: string]: ValidationRule[] } {
            return {
                name: [
                    Validations.required,
                    Validations.maxLength(255),
                ],
            };
        },
    },
    methods: {
        async createWorkspaceList() {
            const list = await this.$workspaces.createList(
                this.$workspaces.active as Workspace,
                this.name
            );

            this.$ui.completeDialog(this.dialog.id, list);
        },
    },
});
</script>
