<template>
    <DialogBase
        :dialog="dialog"
        color="primary"
        persistent
        dark
    >
        <v-card-text>
            {{ message }}
            <v-progress-linear indeterminate color="white" />
        </v-card-text>
    </DialogBase>
</template>

<script lang="ts">
import Vue from 'vue';

import { Dialog } from '@/services/UI';

import DialogBase from '@/dialogs/DialogBase.vue';

export default Vue.extend({
    components: {
        DialogBase,
    },
    props: {
        dialog: {
            type: Object as () => Dialog,
            required: true,
        },
        message: {
            type: String,
            default: 'Loading...',
        },
    },
});
</script>
