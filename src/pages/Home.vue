<template>
    <div class="p-4">
        <component v-if="form" :is="form" @completed="form = null" />
        <TasksManager v-else :list="$workspaces.active.activeList" />
    </div>
</template>

<script lang="ts">
import Vue, { AsyncComponent } from 'vue';

import TasksManager from '@/components/TasksManager.vue';

import EventBus from '@/utils/EventBus';

interface Data {
    form: AsyncComponent | null,
    _listener?: EventListener;
}

export default Vue.extend({
    components: {
        TasksManager,
    },
    data(): Data {
        return {
            form: null,
        };
    },
    created() {
        if (this.$workspaces.empty) {
            // TODO use platform
            this.form = () => import('@/components/forms/solid/CreateWorkspace.vue');
        }

        EventBus.on('create-workspace', this._listener = () => {
            // TODO use platform
            this.form = () => import('@/components/forms/solid/CreateWorkspace.vue');
        });
    },
    destroyed() {
        if (this._listener) {
            EventBus.off('create-workspace', this._listener);
            delete this._listener;
        }
    },
});
</script>
