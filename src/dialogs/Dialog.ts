import Vue from 'vue';

import DialogBase from '@/dialogs/DialogBase.vue';
import DialogForm from '@/dialogs/DialogForm.vue';

import { Dialog } from '@/services/UI';

export default Vue.extend({
    components: {
        DialogBase,
        DialogForm,
    },
    props: {
        title: {
            type: String,
            default: null,
        },
        dialog: {
            type: Object as () => Dialog,
            required: true,
        },
    },
    methods: {
        complete(...args: any[]) {
            this.$ui.completeDialog(this.dialog.id, ...args);
        },
        close(...args: any[]) {
            this.$ui.closeDialog(this.dialog.id, ...args);
        },
    },
});
