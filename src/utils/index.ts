import { fail } from '@noeldemartin/utils';
import type { ValueWithoutEmpty } from '@noeldemartin/utils';

export function lazyRequireProxy<T extends object | null | undefined>(
    get: () => T,
    message: string = 'Lazy required value is missing',
): ValueWithoutEmpty<T> {
    return new Proxy(
        {},
        {
            get(_, property, receiver) {
                const model = get() ?? fail<ValueWithoutEmpty<T>>(message);

                return Reflect.get(model, property, receiver);
            },
            set(_, property, value, receiver) {
                const model = get() ?? fail<ValueWithoutEmpty<T>>(message);

                return Reflect.set(model, property, value, receiver);
            },
        },
    ) as ValueWithoutEmpty<T>;
}
