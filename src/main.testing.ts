import { start, instance } from './bootstrap';

window.Runtime = {
    instance,
    start,
    require: name => {
        const libs: any = {
            'solid-auth-client': require('solid-auth-client'),
        };

        return libs[name];
    },
};
