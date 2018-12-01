<template>
    <div class="bg-background w-screen h-screen flex flex-col items-center justify-center">
        <h1 class="text-4xl">Focus 省</h1>
        <v-form class="w-4/5" @submit.prevent="loginWithSolid">
            <div class="flex">
                <v-text-field v-model="idp" placeholder="Solid URL" />
                <v-btn color="primary" @click="loginWithSolid">Login</v-btn>
            </div>
            <span class="flex w-full my-2 justify-center">
                or
            </span>
            <div class="text-center">
                <v-btn color="primary" @click="loginOffline">Login Offline</v-btn>
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
        loginWithSolid() {
            // TODO show loading
            // TODO handle errors
            this.$auth.loginWithSolid(this.idp);
        },
        loginOffline() {
            // TODO show loading
            // TODO handle errors
            this.$auth.loginOffline();
        },
    },
});
</script>
