<template>
    <div class="flex">
        <Tasks class="flex-grow overflow-hidden" />
        <TaskPanel />
    </div>
</template>

<script lang="ts">
import Vue from 'vue';

import TaskPanel from './TaskPanel.vue';
import Tasks from './Tasks.vue';

export default Vue.extend({
    components: {
        TaskPanel,
        Tasks,
    },
});
</script>
