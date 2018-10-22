import Vue from 'vue';

import App from '@/App.vue';

import plugins from '@/plugins';

import bootstrapServices from '@/services';

Vue.config.productionTip = false;

const app = new Vue({
    ...plugins,
    render: h => h(App),
});

bootstrapServices(app);

app.$mount('#app');
