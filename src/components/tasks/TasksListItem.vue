<template>
    <li
        class="flex h-10 items-center border-b bg-white last-of-type:border-none"
        :class="{ 'line-through': task.isCompleted() }"
    >
        <AGCheckbox class="ml-2" :checked="task.isCompleted()" @update:model-value="task.toggle()">
            {{ task.name }}
        </AGCheckbox>
    </li>
</template>

<script setup lang="ts">
import { requiredObjectProp } from '@aerogel/core';

import type Task from '@/models/Task';

defineProps({ task: requiredObjectProp<Task>() });
</script>
