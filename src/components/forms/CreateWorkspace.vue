<template>
    <v-form class="p-4" @submit.prevent="createWorkspace">
        <h1>Create Workspace</h1>
        <div class="flex">
            <v-text-field v-model="name" />
            <v-btn color="primary" @click="createWorkspace">Create</v-btn>
        </div>
    </v-form>
</template>

<script lang="ts">
import Vue from 'vue';

interface Data {
    name: string;
}

export default Vue.extend({
    data(): Data {
        return {
            name: '',
        };
    },
    methods: {
        createWorkspace() {
            this.$workspaces.create(this.name);
        },
    },
});
</script>
