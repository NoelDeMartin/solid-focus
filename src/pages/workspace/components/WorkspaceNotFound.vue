<template>
    <div
        v-animate
        class="relative isolate flex w-full grow items-center justify-center p-8"
        :initial="{ opacity: 0 }"
        :enter="{ opacity: 1 }"
        :delay="1000"
        :duration="600"
    >
        <WorkspaceNotFoundBackground class="absolute inset-0" />
        <div class="relative z-10 p-8 text-center drop-shadow-[0_0_8px_white]">
            <h1 class="text-4xl font-semibold">
                {{ $t('notFound.title') }}
            </h1>
            <Markdown :lang-key="langKey" :lang-params="langParams" class="mt-4 text-xl text-gray-600" />
            <div class="mt-4 flex justify-center gap-2">
                <Button route="home" class="text-sm">
                    {{ $t('notFound.home') }}
                </Button>
                <Button
                    v-if="!$solid.hasLoggedIn()"
                    variant="ghost"
                    class="text-sm"
                    @click="$ui.modal(AccountLoginModal)"
                >
                    {{ $t('notFound.logIn') }}
                </Button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { AccountLoginModal } from '@aerogel/plugin-local-first';

defineProps<{ langKey: string; langParams?: Record<string, string> }>();
</script>
