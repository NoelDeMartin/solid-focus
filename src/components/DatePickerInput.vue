<template>
    <v-text-field
        :value="renderedValue"
        :placeholder="placeholder"
        prepend-icon="event"
        class="p-0"
        readonly
        clearable
        @input="updateStringValue"
        @click="openDialog"
    />
</template>

<script lang="ts">
import Vue from 'vue';

interface Data {
    date: string | null,
}

export default Vue.extend({
    props: {
        placeholder: {
            type: String,
            default: undefined,
        },
        value: {
            type: Date as unknown as () => Date,
            default: null,
        },
    },
    computed: {
        renderedValue(): string | null {
            if (this.value === null) {
                return null;
            }

            return this.$dayjs(this.value).format('dddd, MMMM Do YYYY');
        },
    },
    methods: {
        focus() {
            this.openDialog();
        },
        updateStringValue(date: string | null) {
            if (date !== null)
                return;

            this.$emit('input', null);
        },
        async openDialog() {
            try {
                const date = await this.$ui.openDialog(
                    () => import('@/dialogs/DatePicker.vue'),
                    { date: this.value },
                );

                this.$emit('input', date);
            } catch (error) {
                // dialog cancelled, nothing to do here
            }
        },
        parseDate(date: string): Date {
            return new Date(Date.parse(date));
        },
    },
});
</script>
