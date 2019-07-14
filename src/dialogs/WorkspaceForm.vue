<template>
    <DialogForm
        :dialog="dialog"
        :title="title"
        :submit-label="submitLabel"
        @completed="createWorkspace"
    >
        <v-select
            v-if="!workspace && storages.length > 1"
            v-model="storage"
            :items="storages"
            :rules="rules.storage"
            label="Storage"
        />
        <v-text-field
            ref="name"
            v-model="name"
            :rules="rules.name"
            label="Name"
            validate-on-blur
            autofocus
        />

        <template v-slot:secondary-actions v-if="workspace">
            <v-btn v-if="$ui.mobile" flat @click="remove">
                <v-icon class="mr-1">delete</v-icon>
                Remove
            </v-btn>
            <v-btn
                v-else
                title="Remove workspace"
                flat
                icon
                @click="remove"
            >
                <v-icon>delete</v-icon>
            </v-btn>
        </template>
    </DialogForm>
</template>

<script lang="ts">
import Vue from 'vue';

import { ValidationRule } from 'vuetify';

import SolidUser from '@/models/users/SolidUser';
import User from '@/models/users/User';
import Workspace from '@/models/soukai/Workspace';

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
        workspace: {
            type: Object as () => Workspace,
            default: null,
        },
    },
    data(): Data {
        return {
            storage: this.$auth.user!.storages[0],
            name: this.workspace ? this.workspace.name : '',
        };
    },
    computed: {
        title(): string {
            return this.workspace ? `Edit "${this.workspace.name}" workspace` : 'Create Workspace';
        },
        submitLabel(): string {
            return this.workspace ? 'Update' : 'Create';
        },
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
        storages(): string[] {
            return this.$auth.user!.storages;
        },
    },
    mounted() {
        // Autofocus does not seem to work as expected inside dialogs
        // see: https://github.com/vuetifyjs/vuetify/search?q=autofocus+dialog&type=Issues
        this.$nextTick((this.$refs.name as any).focus);
    },
    methods: {
        createWorkspace() {
            const attributes = { name: this.name };

            if (this.workspace) {
                // TODO handle async errors
                this.workspace.update(attributes);
            } else {
                const workspace = new Workspace(attributes);

                // TODO handle async errors
                workspace.save(this.storage);
                workspace.setRelationModels('lists', []);

                this.$workspaces.add(workspace);
            }

            this.$ui.completeDialog(this.dialog.id);
        },
        remove() {
            this.$ui.completeDialog(this.dialog.id);
            this.$ui.openDialog(
                () => import('@/dialogs/RemoveWorkspace.vue'),
                { workspace: this.workspace },
            );
        },
    },
});
</script>
