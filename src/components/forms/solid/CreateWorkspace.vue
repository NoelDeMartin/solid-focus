<template>
    <v-form
        ref="form"
        class="p-4"
        lazy-validation
        @submit.prevent="submit"
    >
        <h1>Create Workspace</h1>
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
        <v-btn color="primary" @click="submit">
            Create
        </v-btn>
    </v-form>
</template>

<script lang="ts">
import Vue from 'vue';

import { VForm, ValidationRule } from 'vuetify';

import { User } from '@/services/solid/Auth';
import Workspaces from '@/services/solid/Workspaces';

import Validations from '@/utils/Validations';

interface Data {
    storage: string;
    name: string;
}

export default Vue.extend({
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
        submit() {
            if ((this.$refs.form as VForm).validate()) {
                this.$workspaces
                    .create(this.storage, this.name)
                    .then(() => this.$emit('completed'));
            }
        },
    },
});
</script>
