import Vue from 'vue';

import App from '@/App.vue';

import Auth from '@/services/Auth';
import UI from '@/services/UI';
import Workspaces from '@/services/Workspaces';

import '@/plugins/vuetify';
import '@/plugins/registerServiceWorker';

import store from '@/store';

Vue.config.productionTip = false;

const app = new Vue({
    store,
    render: h => h(App),
});

Vue.prototype.$auth = new Auth(app);
Vue.prototype.$ui = new UI(app);
Vue.prototype.$workspaces = new Workspaces(app);

app.$mount('#app');
