import Vue from 'vue';
import Vuetify from 'vuetify';

import { colors } from '@/styles/tailwind';

import '@babel/polyfill';

Vue.use(Vuetify, {
    theme: {
        primary: colors.jade,
    },
});
