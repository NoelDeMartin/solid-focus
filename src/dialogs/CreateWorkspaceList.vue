<template>
    <DialogForm
        :dialog="dialog"
        title="Create Workspace List"
        submit-label="Create"
        @completed="createWorkspaceList"
    >
        <v-text-field
            ref="name"
            v-model="name"
            :rules="rules.name"
            label="Name"
            validate-on-blur
            autofocus
        />
    </DialogForm>
</template>

<script lang="ts">
import Vue from 'vue';

import { ValidationRule } from 'vuetify';

import { Dialog } from '@/services/UI';

import List from '@/models/soukai/List';
import Workspace from '@/models/soukai/Workspace';

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
    mounted() {
        // Autofocus does not seem to work as expected inside dialogs
        // see: https://github.com/vuetifyjs/vuetify/search?q=autofocus+dialog&type=Issues
        this.$nextTick((this.$refs.name as any).focus);
    },
    methods: {
        createWorkspaceList() {
            this.$ui.completeDialog(this.dialog.id);

            const workspace = this.$workspaces.active as Workspace;
            const list = new List({ name: this.name });

            // TODO handle async errors
            list.save(workspace.url);
            list.setRelationModels('tasks', []);
            list.setRelationModels('workspace', workspace);

            workspace.setRelationModels('lists', [...workspace.lists!, list]);
            workspace.setActiveList(list);
        },
    },
});
</script>
