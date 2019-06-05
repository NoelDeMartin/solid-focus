<template>
    <h1>{{ task.name }}</h1>
</template>

<script>
export default {
    props: {
        task: {
            type: Object,
            required: true,
        },
    },
};
</script>
