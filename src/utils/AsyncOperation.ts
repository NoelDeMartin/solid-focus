import Vue from 'vue';

class DefaultListener implements Listener {

    private ongoingOperations: number = 0;

    public onDelayed(): void {
        this.ongoingOperations++;
        this.updateSnackbar();
    }

    public onCompleted(): void {
        this.ongoingOperations--;
        this.updateSnackbar();
    }

    public onFailed(): void {
        this.ongoingOperations--;
        this.updateSnackbar();
    }

    private updateSnackbar(): void {
        if (this.ongoingOperations === 1)
            Vue.instance.$ui.showSnackbar({
                message: 'Saving changes...',
                loading: true,
            });
        else if (this.ongoingOperations > 0)
            Vue.instance.$ui.showSnackbar({
                message: `Saving ${this.ongoingOperations} changes...`,
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

    private static DEFAULT_LISTENER: Listener = new DefaultListener();

    private listener: Listener;
    private delayTimeout?: NodeJS.Timeout;

    public constructor(listener?: Listener) {
        this.listener = listener || AsyncOperation.DEFAULT_LISTENER;
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
