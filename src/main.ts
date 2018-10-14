import Vue from 'vue';

import App from '@/App.vue';

import Auth from '@/services/Auth';
import UI from '@/services/UI';

import '@/plugins/vuetify';
import '@/plugins/registerServiceWorker';

Vue.config.productionTip = false;

const app = new Vue({
    render: h => h(App),
});

Vue.prototype.$auth = new Auth(app);
Vue.prototype.$ui = new UI(app);

app.$mount('#app');
