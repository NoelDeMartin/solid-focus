/**
 * Services are singletons used throughout the app that encapsulate
 * business logic and interact with Vuex to manipulate application state.
 */

import Vue from 'vue';

export default function bootstrapServices(app: Vue) {
    // TODO use webpack DefinePlugin
    const platform = process.env.PLATFORM || 'solid';

    const UI = require('@/services/UI').default;
    const Auth = require('@/services/' + platform + '/Auth').default;
    const Workspaces = require('@/services/' + platform + '/Workspaces').default;

    Vue.prototype.$ui = new UI(app);
    Vue.prototype.$auth = new Auth(app);
    Vue.prototype.$workspaces = new Workspaces(app);
}
