import Vue from 'vue';

import App from '@/App.vue';

import '@/plugins';

import bootstrapServices from '@/services';
import store from '@/store';

Vue.config.productionTip = false;

const app = new Vue({
    store,
    render: h => h(App),
});

bootstrapServices(app);

app.$mount('#app');
