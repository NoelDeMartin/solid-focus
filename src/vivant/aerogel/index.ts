import { directives } from '@/vivant/vue';
import type { Plugin } from '@aerogel/core';

export default function(): Plugin {
    return {
        install(app) {
            for (const [name, directive] of Object.entries(directives)) {
                app.directive(name, directive);
            }
        },
    };
}
