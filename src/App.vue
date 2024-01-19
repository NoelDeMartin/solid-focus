<template>
    <AGAppLayout class="bg-blue-50">
        <main class="flex flex-grow flex-col items-center justify-center">
            <AppMain v-if="$workspaces.current && $tasksLists.current" />
            <AppOnboarding v-else />
        </main>
    </AGAppLayout>
</template>
