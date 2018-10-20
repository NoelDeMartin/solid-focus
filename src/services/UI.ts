import Service from '@/services/Service';

import { UI as UIInterface } from '@/services/types/UI';

export default class UI extends Service implements UIInterface {

    get mobile(): boolean {
        return this.app.$vuetify.breakpoint.xs;
    }

    get tablet(): boolean {
        return this.app.$vuetify.breakpoint.sm;
    }

    get desktop(): boolean {
        return this.app.$vuetify.breakpoint.mdAndUp;
    }

}
