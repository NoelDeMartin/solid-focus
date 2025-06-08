import i18n from '@aerogel/plugin-i18n';
import localFirst from '@aerogel/plugin-local-first';
import routing from '@aerogel/plugin-routing';
import solid from '@aerogel/plugin-solid';
import soukai from '@aerogel/plugin-soukai';
import vivant from 'vivant';
import { bootstrap } from '@aerogel/core';

import './assets/css/main.css';
import App from './App.vue';
import directives from './components/directives';
import settings from './components/settings';
import { globals, services } from './services';
import { bindings, routes } from './pages';

bootstrap(App, {
    directives,
    settings,
    services,
    plugins: [
        i18n({ messages: import.meta.glob('@/lang/*.yaml') }),
        soukai({ models: import.meta.glob(['@/models/*', '!**/*.test.ts'], { eager: true }) }),
        routing({ routes, bindings }),
        solid(),
        localFirst(),
    ],
    install(app) {
        app.use(vivant());

        Object.assign(app.config.globalProperties, globals);
    },
});
