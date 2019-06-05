<template>
    <div class="bg-background w-screen h-screen flex flex-col items-center justify-center">
        <h1 class="text-4xl">Focus 省</h1>
        <v-form class="w-4/5" @submit.prevent="loginWithSolid">
            <div class="flex">
                <v-select
                    :items="['https://', 'http://']"
                    v-model="prefix"
                    class="flex-no-grow hide-input"
                />
                <v-text-field
                    v-model="idp"
                    :autofocus="true"
                    placeholder="Solid POD"
                    @keyup.enter="loginWithSolid"
                />
                <v-btn color="primary" @click="loginWithSolid">Login</v-btn>
            </div>
            <p v-if="prefix === 'http://'" class="text-red-dark text-sm">
                <strong>Attention!</strong> Using http:// is not secure, use at your own risk.
            </p>
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
            prefix: 'https://',
            idp: '',
        };
    },
    methods: {
        loginWithSolid() {
            this.$ui.wrapAsyncOperation(
                this.$auth.loginWithSolid(this.prefix + this.idp),
                'Logging in...',
            );
        },
        loginOffline() {
            this.$ui.wrapAsyncOperation(
                this.$auth.loginOffline(),
                'Logging in...',
            );
        },
    },
});
</script>
