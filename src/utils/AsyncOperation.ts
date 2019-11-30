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

    public constructor(listener: Listener) {
        this.listener = listener;
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
