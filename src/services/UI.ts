import Service from '@/services//Service';

export default class UI extends Service {

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
