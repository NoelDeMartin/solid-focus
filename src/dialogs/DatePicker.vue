<template>
    <v-dialog
        :value="true"
        :width="290"
        lazy
        full-width
        @input="close"
    >
        <v-date-picker
            :value="stringValue"
            scrollable
            @input="pickDate"
        />
    </v-dialog>
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
        date: {
            type: Date as unknown as () => Date,
            default: null,
        },
    },
    computed: {
        stringValue(): string | null {
            return this.date ? this.date.toISOString().substr(0, 10) : null;
        },
    },
    methods: {
        pickDate(date: string) {
            this.$ui.completeDialog(this.dialog.id, new Date(Date.parse(date)));
        },
        close() {
            this.$ui.closeDialog(this.dialog.id);
        },
    },
});
</script>
