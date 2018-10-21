class Storage {

    public set(key: string, value: any): void {
        localStorage.setItem(key, JSON.stringify(value));
    }

    public get(key: string, defaultValue: any = null): any {
        const value = localStorage.getItem(key);

        return value === null ? defaultValue : JSON.parse(value);
    }

    public has(key: string): boolean {
        return localStorage.getItem(key) !== null;
    }

    public remove(key: string): void {
        localStorage.removeItem(key);
    }

}

export default new Storage();