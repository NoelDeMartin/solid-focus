<template>
    <div class="bg-background w-screen h-screen flex flex-col items-center justify-center">
        <h1 class="flex flex-no-grow mb-4">
            <img class="w-16 h-16 mr-2" src="logo.svg">
            <span class="font-normal italic text-4xl self-end">Focus 省</span>
        </h1>
        <v-form class="w-4/5" @submit.prevent="loginWithSolid">
            <div :class="{ 'flex-col': $ui.mobile }" class="flex">
                <div class="flex">
                    <v-select
                        :items="['https://', 'http://']"
                        :hide-details="true"
                        v-model="prefix"
                        class="flex-no-grow hide-input mt-0 pt-0 self-center"
                    />
                    <v-text-field
                        v-model="idp"
                        :autofocus="true"
                        :hide-details="true"
                        placeholder="Solid POD"
                        class="mt-0 pt-0 self-center"
                        @keyup.enter="loginWithSolid"
                    />
                </div>
                <v-btn
                    :class="{ 'mt-4': $ui.mobile }"
                    class="flex-no-grow self-center"
                    color="primary"
                    @click="loginWithSolid"
                >
                    Login with Solid
                </v-btn>
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
