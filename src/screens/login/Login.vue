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
            <p v-if="errorMessage" class="text-red-dark text-sm" v-html="errorMessage" />
            <span class="flex w-full my-2 justify-center">
                or
            </span>
            <div class="text-center">
                <v-btn color="primary" @click="loginOffline">Login Offline</v-btn>
            </div>
        </v-form>
        <AppInfo tag="footer" class="absolute pin-r pin-b p-4" />
    </div>
</template>

<script lang="ts">
import Vue from 'vue';

import AppInfo from '@/components/AppInfo.vue';

export default Vue.extend({
    components: {
        AppInfo,
    },
    data() {
        return {
            prefix: 'https://',
            idp: '',
            solidLoginAttempted: false,
        };
    },
    computed: {
        errorMessage() {
            if (this.solidLoginAttempted && !this.idp)
                return '<strong>Attention!</strong> This field should not be left empty to login with Solid.';

            if (this.prefix === 'http://')
                return '<strong>Attention!</strong> Using http:// is not secure, use at your own risk.';
        },
    },
    methods: {
        loginWithSolid() {
            this.solidLoginAttempted = true;

            if (!this.idp)
                return;

            this.$ui.wrapAsyncOperation(
                async () => {
                    try {
                        await this.$auth.loginWithSolid(this.prefix + this.idp);
                    } catch (error) {
                        throw new Error(
                            'Login with Solid failed, make sure that you introduced the correct ' +
                            'Solid POD url and the POD server is running',
                        );
                    }
                },
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
