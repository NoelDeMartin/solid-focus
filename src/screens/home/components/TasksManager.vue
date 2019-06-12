<template>
    <div class="flex">
        <Tasks class="flex-grow" />
    </div>
</template>

<script lang="ts">
import Vue from 'vue';

import Tasks from './Tasks.vue';

export default Vue.extend({
    components: {
        Tasks,
    },
});
</script>
