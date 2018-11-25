/**
 * Services are singletons used throughout the app that encapsulate
 * business logic and interact with Vuex to manipulate application state.
 */

import Vue from 'vue';

import Service from '@/services/Service';

export default async function bootServices(app: Vue): Promise<void> {
    const serviceClasses = await Promise.all([
        import('@/services/UI'),
        import('@/services/Auth'),
    ]);

    const [UI, Auth] = serviceClasses.map(service => service.default);

    Vue.prototype.$services = [
        Vue.prototype.$ui = new UI(app),
        Vue.prototype.$auth = new Auth(app),
    ];

    await Promise.all(Vue.prototype.$services.map((service: Service) => service.ready));
}
