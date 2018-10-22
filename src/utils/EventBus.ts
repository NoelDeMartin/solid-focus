import Vue from 'vue';

class EventBus {

    private bus = new Vue();

    public on(event: string, callback: Function): void {
        this.bus.$on(event, callback);
    }

    public emit(event: string, payload?: any): void {
        this.bus.$emit(event, payload);
    }

}

export default new EventBus();
