<script lang="ts">
import Vue, { VNode, CreateElement } from 'vue';

import UUIDGenerator from '@/utils/UUIDGenerator';

interface Data {
    uuid: string;
}

const rendersCache: { [uuid: string]: VNode[] | undefined } = {};

export default Vue.extend({
    props: {
        tag: {
            type: String,
            default: 'div',
        },
        frozen: {
            type: Boolean,
            default: false,
        },
        frozenProps: {
            type: Object,
            default: () => {},
        },
    },
    data() {
        return {
            uuid: UUIDGenerator.generate(),
        };
    },
    destroyed() {
        delete rendersCache[this.uuid];
    },
    methods: {
        renderChildren(h: CreateElement, children: VNode[]): VNode {
            return h(this.tag, {}, children);
        },
    },
    render(h: CreateElement): VNode {
        if (this.frozen) {
            return this.renderChildren(h, rendersCache[this.uuid] || []);
        }

        rendersCache[this.uuid] = this.$scopedSlots.default
            ? this.$scopedSlots.default(this.frozenProps)
            : this.$slots.default;

        return this.renderChildren(h, rendersCache[this.uuid] || []);
    },
});
</script>
