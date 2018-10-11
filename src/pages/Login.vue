<template>
    <div class="bg-background w-screen h-screen flex flex-col items-center justify-center">
        <h1 class="text-4xl">Focus 省</h1>
        <v-form class="w-4/5" @submit.prevent="login">
            <div class="flex">
                <v-text-field v-model="idp" />
                <v-btn color="primary" @click="login">Login</v-btn>
            </div>
        </v-form>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
    data() {
        return {
            idp: '',
        };
    },
    methods: {
        login() {
            // TODO show loading
            // TODO handle errors
            this.$auth.login(this.idp);
        },
    },
});
</script>
