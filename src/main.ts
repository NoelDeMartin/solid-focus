import Vue from 'vue';

import App from '@/App.vue';

import Auth from '@/services/Auth';

import '@/plugins/vuetify';
import '@/plugins/registerServiceWorker';

Vue.config.productionTip = false;

Vue.prototype.$auth = Auth;

new Vue({
    render: h => h(App),
}).$mount('#app');
