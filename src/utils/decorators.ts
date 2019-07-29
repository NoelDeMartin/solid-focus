interface Decorations {
    getters?: {
        [field: string]: () => any;
    };
}

export function decorate<T extends object>(target: T, decorations: Decorations): T {
    const getters = decorations.getters || {};

    return new Proxy(target, {
        get(target, property, receiver) {
            if (typeof property === 'string' && getters.hasOwnProperty(property)) {
                return getters[property]();
            }

            return Reflect.get(target, property, receiver);
        },
    });
}
