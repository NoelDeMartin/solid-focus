import Vue from 'vue';

import App from '@/App.vue';

import plugins from '@/plugins';

import bootServices from '@/services';

Vue.config.productionTip = false;

export const instance = new Vue({
    ...plugins,
    render: h => h(App),
});

export async function start(): Promise<void> {
    await bootServices(instance)
        .catch(error => error)
        .then(error => {
            instance.$mount('#app');

            if (error) {
                instance.$ui.showError(error);
            }

            document.body.removeAttribute('loading');
        });
}
