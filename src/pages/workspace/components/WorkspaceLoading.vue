<template>
    <div
        class="text-primary-500 flex grow items-center justify-center transition-opacity duration-1000"
        :class="ready ? 'opacity-100' : 'opacity-0'"
    >
        <svg
            width="60"
            height="15"
            viewBox="0 0 120 30"
            class="fill-current"
        >
            <circle cx="15" cy="15" r="15" />
            <circle cx="60" cy="15" r="15" />
            <circle cx="105" cy="15" r="15" />
        </svg>
    </div>
</template>

<script setup lang="ts">
import { after } from '@noeldemartin/utils';
import { onMounted, ref } from 'vue';

const ready = ref(false);

onMounted(() => after({ ms: 600 }).then(() => (ready.value = true)));
</script>

<style scoped>
svg circle:nth-child(1) {
    transform-origin: 12.5% 50%;
}

svg circle:nth-child(2) {
    transform-origin: 50% 50%;
}

svg circle:nth-child(3) {
    transform-origin: 87.5% 50%;
}

svg circle:nth-child(1),
svg circle:nth-child(3) {
    animation: heartbeat-up 1s infinite;
}

svg circle:nth-child(2) {
    animation: heartbeat-down 1s infinite;
}

@keyframes heartbeat-up {
    0% {
        transform: scale(1);
        opacity: 1;
    }
    50% {
        transform: scale(0.7);
        opacity: 0.3;
    }
    100% {
        transform: scale(1);
        opacity: 1;
    }
}

@keyframes heartbeat-down {
    0% {
        transform: scale(0.7);
        opacity: 0.3;
    }
    50% {
        transform: scale(1);
        opacity: 1;
    }
    100% {
        transform: scale(0.7);
        opacity: 0.3;
    }
}
</style>
