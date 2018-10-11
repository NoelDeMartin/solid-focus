import Vue from 'vue';

export default class Reactive {

    public static object<T>(data: T): T {
        return new Vue({ data });
    }

}
