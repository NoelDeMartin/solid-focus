import Vue from 'vue';

import App from '@/App.vue';

import plugins from '@/plugins';

import bootServices from '@/services';

import '@/filters';

Vue.config.productionTip = false;

Vue.instance = new Vue({
    ...plugins,
    render: h => h(App),
});

export async function start(): Promise<void> {
    await bootServices(Vue.instance)
        .catch(error => error)
        .then(error => {
            Vue.instance.$mount('#app');

            document.body.removeAttribute('loading');

            if (error)
                Vue.instance.$ui.showError(error);
        });
}
