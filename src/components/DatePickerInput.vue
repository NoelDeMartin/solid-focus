<template>
    <v-dialog
        v-model="showDialog"
        :width="290"
        lazy
        full-width
    >
        <template v-slot:activator="{}">
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
        <v-date-picker
            :value="stringValue"
            scrollable
            @input="updateStringValue"
        />
    </v-dialog>
</template>

<script lang="ts">
import Vue from 'vue';

interface Data {
    date: string | null,
    showDialog: boolean,
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
    data: (): Data => ({
        date: null,
        showDialog: false,
    }),
    computed: {
        stringValue(): string | null {
            return this.value ? this.value.toISOString().substr(0, 10) : null;
        },
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
            if (date === null) {
                this.$emit('input', null);
                return;
            }

            this.$emit('input', this.parseDate(date));
            this.showDialog = false;
        },
        openDialog() {
            if (!this.value) {
                this.$emit('input', new Date());
            }

            this.showDialog = true;
        },
        parseDate(date: string): Date {
            return new Date(Date.parse(date));
        },
    },
});
</script>
