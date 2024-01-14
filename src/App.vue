<template>
    <AGAppLayout class="bg-blue-50">
        <main class="flex flex-grow flex-col items-center justify-center">
            <AppHome v-if="$workspaces.current" :workspace="$workspaces.current" />
            <AppOnboarding v-else />
        </main>
    </AGAppLayout>
</template>
