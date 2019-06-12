import Vue from 'vue';
import Vuetify from 'vuetify';

import Styles from '@/styles/variables';

import '@babel/polyfill';

Vue.use(Vuetify, {
    theme: {
        primary: Styles.colors.jade,
    },
});
