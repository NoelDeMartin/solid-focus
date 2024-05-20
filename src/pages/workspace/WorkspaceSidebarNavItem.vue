<template>
    <li :class="isActive && 'bg-[var(--primary-100)]'" :aria-current="isActive && 'page'">
        <AGLink class="block px-6 py-4" :class="isActive && 'font-semibold'" v-bind="list.routeAttributes">
            {{ $listName(list) }}
        </AGLink>
    </li>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { requiredObjectProp } from '@aerogel/core';

import TasksLists from '@/services/TasksLists';
import type TasksList from '@/models/TasksList';

const props = defineProps({ list: requiredObjectProp<TasksList>() });
const isActive = computed(() => props.list.url === TasksLists.current?.url);
</script>
