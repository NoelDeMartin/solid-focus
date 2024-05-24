<template>
    <div>
        <ul v-if="tasks.length">
            <TasksListItem v-for="task of tasks" :key="task.url" :task="task" />
        </ul>
        <AGMarkdown v-else lang-key="tasks.empty" />
    </div>
</template>

<script setup lang="ts">
import { requiredArrayProp } from '@aerogel/core';

import type Task from '@/models/Task';

defineProps({ tasks: requiredArrayProp<Task>() });
</script>
