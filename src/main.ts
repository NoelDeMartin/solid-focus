import i18n from '@aerogel/plugin-i18n';
import offlineFirst from '@aerogel/plugin-offline-first';
import routing from '@aerogel/plugin-routing';
import solid from '@aerogel/plugin-solid';
import soukai from '@aerogel/plugin-soukai';
import vivant from '@/vivant/aerogel';
import { bootstrap } from '@aerogel/core';

import './assets/css/styles.css';
import App from './App.vue';
import { components } from './components';
import { globals, services } from './services';
import { bindings, routes } from './pages';

bootstrap(App, {
    components,
    services,
    plugins: [
        i18n({ messages: import.meta.glob('@/lang/*.yaml') }),
        soukai({ models: import.meta.glob(['@/models/*', '!**/*.test.ts'], { eager: true }) }),
        routing({ routes, bindings }),
        solid(),
        offlineFirst(),
        vivant(),
    ],
    install(app) {
        Object.assign(app.config.globalProperties, globals);
    },
});
