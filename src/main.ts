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

        document.body.removeAttribute('loading');

        if (error) {
            app.$ui.showError(error);
        }
    });
