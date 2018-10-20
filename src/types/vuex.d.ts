import Store, { Payload } from 'vuex';

// Remove when fix for https://github.com/vuejs/vuex/issues/1066 is included in a release
declare module 'vuex' {

    export interface ActionPayload extends Payload {
        payload: any;
    }

    interface Store<S> {
        subscribeAction<P extends ActionPayload>(fn: (action: P, state: S) => any): () => void;
    }

}
