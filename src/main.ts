import i18n from '@aerogel/plugin-i18n';
import soukai from '@aerogel/plugin-soukai';
import routing from '@aerogel/plugin-routing';
import { bootstrap } from '@aerogel/core';

import './assets/css/styles.css';
import App from './App.vue';
import { globals, services } from './services';
import { bindings, routes } from './pages';

bootstrap(App, {
    services,
    plugins: [
        i18n({ messages: import.meta.glob('@/lang/*.yaml') }),
        soukai({ models: import.meta.glob(['@/models/*', '!**/*.test.ts'], { eager: true }) }),
        routing({ routes, bindings }),
    ],
    install(app) {
        Object.assign(app.config.globalProperties, globals);
    },
});
