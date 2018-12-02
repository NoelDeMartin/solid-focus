<template>
    <DialogForm
        :dialog="dialog"
        title="Create Workspace"
        submit-label="Create"
        @completed="createWorkspace"
    >
        <v-select
            v-if="$auth.mode === Mode.Solid"
            v-model="storage"
            :items="$auth.user.pods"
            :rules="rules.storage"
            label="Storage"
        />
        <v-text-field
            ref="name"
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
import { Mode } from '@/services/Auth';

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
        Mode: () => Mode,
    },
    created() {
        if (this.$auth.mode === Mode.Solid) {
            this.$auth.withUser((user: User) => {
                this.storage = (user as SolidUser).pods[0];
            });
        }
    },
    mounted() {
        (this.$refs.name as HTMLInputElement).focus();
    },
    methods: {
        async createWorkspace() {
            let args: any[] = [];
            switch (this.$auth.mode) {
                case Mode.Offline:
                    args = [this.name];
                    break;
                case Mode.Solid:
                    args = [this.storage, this.name];
                    break;
            }

            const workspace = await this.$ui.wrapAsyncOperation(
                this.$workspaces.createWorkspace(...args)
            );

            this.$ui.completeDialog(this.dialog.id, workspace);
        },
    },
});
</script>
