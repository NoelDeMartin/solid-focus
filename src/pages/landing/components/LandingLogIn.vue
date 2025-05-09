<template>
    <div class="mt-8 max-w-full">
        <div v-if="$solid.loginStale || $solid.loginOngoing" class="flex items-center justify-center">
            <i-svg-spinners-90-ring-with-bg class="text-primary-600 mr-2 size-8" />
            <Markdown v-if="$solid.loginStale" class="whitespace-nowrap" lang-key="solid.loginStale" />
            <Markdown v-else-if="$solid.loginOngoing" class="whitespace-nowrap" lang-key="solid.loginOngoing" />
        </div>

        <div v-else class="mt-10 w-md">
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
