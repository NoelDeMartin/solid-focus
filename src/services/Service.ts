import Vue from 'vue';

export default abstract class Service {

    protected app: Vue;

    public readonly ready: Promise<void>;

    constructor(app: Vue) {
        this.app = app;
        this.ready = this.init();
    }

    protected async init(): Promise<void> {
        return Promise.resolve();
    }

}