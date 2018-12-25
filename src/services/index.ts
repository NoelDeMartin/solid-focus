/**
 * Services are singletons used throughout the app that encapsulate
 * business logic and interact with Vuex to manipulate application state.
 */

import Vue from 'vue';

import UI from '@/services/UI';
import Auth from '@/services/Auth';
import Config from '@/services/Config';
import Service from '@/services/Service';
import Workspaces from '@/services/Workspaces';

export default async function bootServices(app: Vue): Promise<void> {
    Vue.prototype.$services = [
        Vue.prototype.$ui = new UI(app),
        Vue.prototype.$auth = new Auth(app),
        Vue.prototype.$config = new Config(app),
        Vue.prototype.$workspaces = new Workspaces(app),
    ];

    await Promise.all(Vue.prototype.$services.map((service: Service) => service.ready));
}
