class Clock {

    public sleep(wait: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, wait));
    }

}

export default new Clock();
