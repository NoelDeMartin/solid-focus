import { objectWithout } from '@noeldemartin/utils';
import type { Obj, ObjectWithout } from '@noeldemartin/utils';

export type Falsish = null | undefined | false;

export function objectWithoutFalsish<T extends Obj>(obj: T): ObjectWithout<T, Falsish> {
    return objectWithout(obj, (value): value is Falsish => value === null || value === undefined || value === false);
}
