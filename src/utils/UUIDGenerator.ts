class UUIDGenerator {

    private counter: number = 0;

    public generate(): number {
        return this.counter++;
    }

}

export default new UUIDGenerator();
