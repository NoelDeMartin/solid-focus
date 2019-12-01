import Vue from 'vue';

class DefaultListener implements Listener {

    private static ongoingDelayedOperations: number = 0;

    private delayed: boolean = false;

    public onDelayed(): void {
        DefaultListener.ongoingDelayedOperations++;
        this.delayed = true;
        this.updateSnackbar();
    }

    public onCompleted(): void {
        if (!this.delayed)
            return;

        DefaultListener.ongoingDelayedOperations--;
        this.updateSnackbar();
    }

    public onFailed(): void {
        if (!this.delayed)
            return;

        DefaultListener.ongoingDelayedOperations--;
        this.updateSnackbar();
    }

    private updateSnackbar(): void {
        if (DefaultListener.ongoingDelayedOperations === 1)
            Vue.instance.$ui.showSnackbar({
                message: 'Saving changes...',
                loading: true,
            });
        else if (DefaultListener.ongoingDelayedOperations > 0)
            Vue.instance.$ui.showSnackbar({
                message: `Saving ${DefaultListener.ongoingDelayedOperations} changes...`,
                loading: true,
            });
        else
            Vue.instance.$ui.hideSnackbar();
    }

}

export interface Listener {
    onStarted?(): void;
    onDelayed?(): void;
    onCompleted?(): void;
    onFailed?(): void;
}

export default class AsyncOperation {

    public static DEFAULT_EXPECTED_DURATION = 1000;

    private listener: Listener;
    private delayTimeout?: NodeJS.Timeout;

    public constructor(listener?: Listener) {
        this.listener = listener || new DefaultListener;
    }

    public start(expectedDuration?: number): void {
        this.delayTimeout = setTimeout(
            () => this.emit('onDelayed'),
            expectedDuration || AsyncOperation.DEFAULT_EXPECTED_DURATION,
        );

        this.emit('onStarted');
    }

    public complete(): void {
        this.clearDelayTimeout();

        this.emit('onCompleted');
    }

    public fail(): void {
        this.clearDelayTimeout();

        this.emit('onFailed');
    }

    private clearDelayTimeout() {
        if (!this.delayTimeout)
            return;

        clearTimeout(this.delayTimeout);
        delete this.delayTimeout;
    }

    private emit(event: keyof Listener): void {
        if (event in this.listener)
            (this.listener[event] as any)();
    }

}
