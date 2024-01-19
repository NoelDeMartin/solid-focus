import i18n from '@aerogel/plugin-i18n';
import soukai from '@aerogel/plugin-soukai';
import { bootstrap } from '@aerogel/core';

import './assets/css/styles.css';
import App from './App.vue';
import { globals, services } from './services';

bootstrap(App, {
    services,
    plugins: [
        i18n({ messages: import.meta.glob('@/lang/*.yaml') }),
        soukai({ models: import.meta.glob(['@/models/*', '!**/*.test.ts'], { eager: true }) }),
    ],
    install(app) {
        Object.assign(app.config.globalProperties, globals);
    },
});
