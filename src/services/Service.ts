import Vue from 'vue';

export default abstract class Service {

    protected app: Vue;

    public readonly ready: Promise<void>;

    constructor(app: Vue) {
        this.app = app;

        // defer calling init() until constructor has completed
        this.ready = Promise.resolve().then(() => this.init());
    }

    protected async init(): Promise<void> {
        return Promise.resolve();
    }

}