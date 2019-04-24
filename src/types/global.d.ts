import Vue from 'vue';

declare global {

    interface TestingRuntime {
        instance: Vue;
        start(): Promise<void>;
        require(name: string): any;
    }

    interface Window {
        Runtime?: TestingRuntime;
    }

}
