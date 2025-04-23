<template>
    <div class="mt-8 max-w-full">
        <Markdown v-if="$solid.loginStale" lang-key="solid.loginStale" lang-default="This is taking too long..." />
        <Markdown v-else-if="$solid.loginOngoing" lang-key="ui.loading" lang-default="Loading..." />

        <div v-else class="mt-10 max-w-md">
            <h2 class="mt-6 text-center text-xl leading-6 font-semibold text-gray-900">
                {{ $t('landing.logIn.title') }}
            </h2>

            <div class="mt-4 flex flex-col items-center gap-y-2">
                <SolidLogin no-loading allow-legacy-authenticator layout="vertical" />
                <Button
                    variant="ghost"
                    class="mx-auto self-center px-3.5 py-2.5 text-sm font-semibold"
                    @click="$events.emit('landing:reset')"
                >
                    <i-zondicons-arrow-left class="size-3" />
                    <span>{{ $t('landing.logIn.back') }}</span>
                </Button>
            </div>
        </div>
    </div>
</template>
