import Vue from 'vue';

declare global {

    interface Window {
        __app__?: Vue;
    }

}
