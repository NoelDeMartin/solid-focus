import Vue from 'vue';

import App from '@/App.vue';

import plugins from '@/plugins';

import bootServices from '@/services';

Vue.config.productionTip = false;

const app = new Vue({
    ...plugins,
    render: h => h(App),
});

bootServices(app).then(() => {
    app.$mount('#app');

    document.body.removeAttribute('loading');
});
