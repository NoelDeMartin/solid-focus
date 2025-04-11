<template>
    <Modal>
        <div class="px-2 py-8">
            <div class="mx-auto aspect-5/2 w-64 max-w-[60vw]">
                <i-app-logo class="size-full" />
            </div>
            <h2 class="sr-only">
                {{ $t('about.title') }}
            </h2>
            <Markdown
                lang-key="about.info"
                :lang-params="{ sourceUrl: $app.sourceUrl }"
                class="mt-6 text-center text-gray-700"
            />
        </div>
    </Modal>
</template>
