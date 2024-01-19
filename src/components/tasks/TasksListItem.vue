<template>
    <li>
        {{ task.name }}
    </li>
</template>

<script setup lang="ts">
import { requiredObjectProp } from '@aerogel/core';

import type Task from '@/models/Task';

defineProps({ task: requiredObjectProp<Task>() });
</script>
