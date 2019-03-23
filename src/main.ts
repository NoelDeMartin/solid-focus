import Vue from 'vue';

import App from '@/App.vue';

import plugins from '@/plugins';

import bootServices from '@/services';

Vue.config.productionTip = false;

const app = new Vue({
    ...plugins,
    render: h => h(App),
});

bootServices(app)
    .catch(error => error)
    .then(error => {
        app.$mount('#app');

        if (app.$config.isTesting) {
            window.__app__ = app;
        }

        if (error) {
            app.$ui.showError(error);
        }

        document.body.removeAttribute('loading');
    });
