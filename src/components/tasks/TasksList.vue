<template>
    <ul v-if="tasks.length" class="list-disc pl-4">
        <TasksListItem v-for="task of tasks" :key="task.id" :task="task" />
    </ul>

    <AGMarkdown v-else lang-key="tasks.empty" />
</template>

<script setup lang="ts">
import { requiredArrayProp } from '@aerogel/core';

import type Task from '@/models/Task';

defineProps({ tasks: requiredArrayProp<Task>() });
</script>
