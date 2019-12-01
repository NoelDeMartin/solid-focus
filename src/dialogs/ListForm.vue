<template>
    <DialogForm
        :dialog="dialog"
        :title="title"
        :submit-label="submitLabel"
        @completed="submit"
    >
        <v-text-field
            ref="name"
            v-model="name"
            :rules="rules.name"
            label="Name"
            validate-on-blur
            autofocus
        />

        <template v-slot:secondary-actions v-if="list">
            <v-btn v-if="$ui.mobile" flat @click="remove">
                <v-icon class="mr-1">delete</v-icon>
                Remove
            </v-btn>
            <v-btn
                v-else
                title="Remove list"
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

import { SolidEngine } from 'soukai-solid';
import { ValidationRule } from 'vuetify';
import Soukai, { Attributes } from 'soukai';

import { Dialog } from '@/services/UI';

import List from '@/models/soukai/List';
import Workspace from '@/models/soukai/Workspace';

import DialogForm from '@/dialogs/DialogForm.vue';

import AsyncOperation from '@/utils/AsyncOperation';
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
        list: {
            type: Object as () => List,
            default: null,
        },
    },
    data(): Data {
        return {
            name: this.list ? this.list.name : '',
        };
    },
    computed: {
        title(): string {
            return this.list ? `Edit "${this.list.name}" list` : 'Create workspace list';
        },
        submitLabel(): string {
            return this.list ? 'Update' : 'Create';
        },
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
        submit() {
            const attributes = { name: this.name };

            if (this.list)
                this.updateList(attributes, { name: this.list.name });
            else
                this.createList(attributes);

            this.$ui.completeDialog(this.dialog.id);
        },
        async updateList(attributes: Attributes, originalAttributes: Attributes) {
            const operation = new AsyncOperation;

            try {
                operation.start();

                await this.list.update(attributes);

                operation.complete();
            } catch (error) {
                operation.fail();

                // TODO implement this.list.setAttributes(originalAttributes); in soukai
                for (const attribute in originalAttributes) {
                    this.list.setAttribute(attribute, originalAttributes[attribute]);
                }

                this.$ui.showError(error);
            }
        },
        async createList(attributes: Attributes) {
            const workspace = this.$workspaces.active as Workspace;
            const list = new List(attributes);
            const originalList = workspace.activeList;
            const operation = new AsyncOperation;

            try {
                operation.start();

                workspace.setRelationModels('lists', [...workspace.lists!, list]);
                workspace.setActiveList(list);

                list.setRelationModels('tasks', []);
                list.setRelationModels('workspace', workspace);

                await list.save(workspace.url);

                // TODO handle this in soukai-solid instead
                if (!(Soukai.engine instanceof SolidEngine)) {
                    await workspace.update({
                        resourceUrls: [...workspace.resourceUrls, list.url],
                    });
                }

                operation.complete();
            } catch (error) {
                operation.fail();

                const index = workspace.lists!.indexOf(list);
                const lists = [...workspace.lists!];

                lists.splice(index, 1);

                workspace.setActiveList(originalList);
                workspace.setRelationModels('lists', lists);

                this.$ui.showError(error);
            }
        },
        remove() {
            this.$ui.completeDialog(this.dialog.id);
            this.$ui.openDialog(
                () => import('@/dialogs/RemoveList.vue'),
                { list: this.list },
            );
        },
    },
});
</script>
