import Vue from 'vue';

import 'vuetify';

declare module 'vuetify' {

    export interface VForm extends Vue {
        validate(): boolean;
    }

    type ValidationResult = boolean | string;
    export type ValidationRule = ValidationResult | ((value: any) => ValidationResult);

}
