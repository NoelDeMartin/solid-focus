<template>
    <AGAppLayout class="bg-blue-50">
        <main class="flex flex-grow flex-col items-center justify-center">
            <h1 class="text-4xl font-semibold">
                {{ $t('home.title') }}
            </h1>
            <a href="https://aerogel.js.org" target="_blank" class="mt-2 underline opacity-75 hover:opacity-100">
                {{ $t('home.getStarted') }}
            </a>
        </main>
    </AGAppLayout>
</template>
