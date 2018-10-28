/**
 * Services are singletons used throughout the app that encapsulate
 * business logic and interact with Vuex to manipulate application state.
 */

import Vue from 'vue';

import Service from '@/services/Service';

export default async function bootServices(app: Vue): Promise<void> {
    // TODO use webpack DefinePlugin
    const platform = process.env.PLATFORM || 'solid';

    const serviceClasses = await Promise.all([
        import('@/services/UI'),
        import('@/services/' + platform + '/Auth'),
        import('@/services/' + platform + '/Workspaces'),
    ]);

    const [UI, Auth, Workspaces] = serviceClasses.map(service => service.default);

    Vue.prototype.$services = [
        Vue.prototype.$ui = new UI(app),
        Vue.prototype.$auth = new Auth(app),
        Vue.prototype.$workspaces = new Workspaces(app),
    ];

    await Promise.all(Vue.prototype.$services.map((service: Service) => service.ready));
}
