class Arr {

    public last<T>(array: T[]): T {
        return array[array.length - 1];
    }

    public make<T>(length: number, value: T | any = null): T[] {
        return (new Array(length)).fill(value);
    }

}

export default new Arr();
