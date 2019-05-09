<template>
    <DialogForm
        v-slot="{ submit }"
        :dialog="dialog"
        title="Create Workspace"
        submit-label="Create"
        @completed="createWorkspace"
    >
        <v-select
            v-if="storages.length > 0"
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
            @keydown.enter="submit"
        />
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
            storage: Workspace.collection,
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
        storages(): string[] {
            return this.$auth.mode === Mode.Solid
                ? (this.$auth.user as SolidUser).storages
                : [];
        },
    },
    created() {
        if (this.$auth.mode === Mode.Solid) {
            this.$auth.withUser((user: User) => {
                this.storage = (user as SolidUser).storages[0];
            });
        }
    },
    mounted() {
        // Autofocus does not seem to work as expected inside dialogs
        // see: https://github.com/vuetifyjs/vuetify/search?q=autofocus+dialog&type=Issues
        this.$nextTick((this.$refs.name as any).focus);
    },
    methods: {
        createWorkspace() {
            this.$ui.completeDialog(this.dialog.id);

            const workspace = new Workspace({ name: this.name });

            // TODO handle async errors
            workspace.save(this.storage);
            workspace.setRelation('lists', []);

            this.$workspaces.add(workspace);
        },
    },
});
</script>
