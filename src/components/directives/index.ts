import type { Directive } from 'vue';

import intersect, { type IntersectDirectiveListener } from './intersect';

export default {
    intersect,
};

declare module 'vue' {
    interface ComponentCustomDirectives {
        intersect: Directive<HTMLElement, IntersectDirectiveListener>;
    }
}
