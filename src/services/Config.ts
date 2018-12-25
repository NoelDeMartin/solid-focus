import Service from '@/services/Service';

export default class Config extends Service {

    public version!: string;

    protected async init(): Promise<void> {
        await super.init();

        this.version = process.env.VUE_APP_VERSION + (
            process.env.NODE_ENV === 'development' ? '-dev' : ''
        );
    }

}
