<template>
    <div ref="$root" class="relative flex justify-center pt-8">
        <div class="w-full max-w-screen-lg px-8">
            <div class="m-auto flex w-fit gap-2">
                <i-twemoji-thinking-face class="mt-8 h-20 w-20" />
                <span class="mb-2 h-4 w-4 self-center rounded-full bg-white" />
                <span class="mb-6 h-4 w-4 self-center rounded-full bg-white" />
                <p class="self-start rounded-full bg-white p-4">
                    {{ $t('landing.featuresPrompt') }}
                </p>
            </div>

            <AGMarkdown
                lang-key="landing.featuresIntro"
                class="mt-16 w-full text-center text-2xl font-light"
                singleline
            />

            <div class="ml-auto mt-32 flex w-fit gap-8">
                <img src="@/assets/img/landing/workspaces.png" alt="" class="w-60 rounded-full">
                <div class="max-w-[550px]">
                    <h2 id="workspaces" class="scroll-mt-32 text-3xl font-bold text-blue-900">
                        {{ $t('landing.workspacesTitle') }}
                    </h2>
                    <AGMarkdown lang-key="landing.workspacesDescription" class="mt-8 text-lg font-light" />
                </div>
            </div>

            <div class="ml-16 mt-32 flex gap-8">
                <div class="max-w-[500px]">
                    <h2 id="local-first" class="scroll-mt-32 text-3xl font-bold text-blue-900">
                        {{ $t('landing.localFirstTitle') }}
                    </h2>
                    <AGMarkdown lang-key="landing.localFirstDescription" class="mt-8 text-lg font-light" />
                </div>
                <i-twemoji-locked-with-key class="h-40 w-40" />
            </div>

            <div class="mt-32 flex flex-col items-center">
                <h2 id="pwa" class="scroll-mt-32 text-3xl font-bold text-blue-900">
                    {{ $t('landing.pwaTitle') }}
                </h2>
                <AGMarkdown lang-key="landing.pwaDescription" class="mt-8 max-w-full text-lg font-light" />

                <div class="mt-8 flex gap-4">
                    <div class="flex-1">
                        <img src="@/assets/img/landing/pwa-mobile.png" alt="" class="w-full rounded border">
                    </div>
                    <div class="flex-[2.8]">
                        <img src="@/assets/img/landing/pwa-desktop.png" alt="" class="w-full rounded border">
                    </div>
                </div>
            </div>

            <div class="mt-32 flex w-fit gap-8">
                <i-app-solid class="h-52 w-52" />
                <div class="max-w-[550px]">
                    <h2 id="solid" class="scroll-mt-32 text-3xl font-bold text-blue-900">
                        {{ $t('landing.solidTitle') }}
                    </h2>
                    <AGMarkdown lang-key="landing.solidDescription" class="mt-8 text-lg font-light" />
                </div>
            </div>

            <div class="ml-16 mt-32 flex gap-8">
                <div class="max-w-[550px]">
                    <h2 id="a11y" class="scroll-mt-32 text-3xl font-bold text-blue-900">
                        {{ $t('landing.a11yTitle') }}
                    </h2>
                    <AGMarkdown lang-key="landing.a11yDescription" class="mt-8 text-lg font-light" />
                </div>
                <i-twemoji-globe-showing-europe-africa class="h-40 w-40" />
            </div>

            <h2 class="mt-32 text-center text-3xl font-bold text-blue-900">
                {{ $t('landing.more') }}
            </h2>

            <ul class="mt-6 grid grid-cols-3 gap-6">
                <li class="flex flex-col items-center gap-y-2 rounded bg-gray-200 p-8">
                    <i-ion-logo-markdown class="h-12 w-12" />
                    <AGMarkdown lang-key="landing.moreMarkdown" class="text-lg" />
                </li>
                <li class="flex flex-col items-center gap-y-2 rounded bg-gray-200 p-8">
                    <i-material-symbols-edit-document-rounded class="h-12 w-12" />
                    <AGMarkdown lang-key="landing.moreScratchpad" class="text-lg" />
                </li>
                <li class="flex flex-col items-center gap-y-2 rounded bg-gray-200 p-8">
                    <i-material-symbols-calendar-clock-rounded class="h-12 w-12" />
                    <AGMarkdown lang-key="landing.moreDeadlines" class="text-lg" />
                </li>
                <li class="flex flex-col items-center gap-y-2 rounded bg-gray-200 p-8">
                    <i-ic-sharp-star class="h-12 w-12" />
                    <AGMarkdown lang-key="landing.moreStarred" class="text-lg" />
                </li>
                <li class="flex flex-col items-center gap-y-2 rounded bg-gray-200 p-8">
                    <i-material-symbols-search-rounded class="h-12 w-12" />
                    <AGMarkdown lang-key="landing.moreSearch" class="text-lg" />
                </li>
                <li class="flex flex-col items-center gap-y-2 rounded bg-gray-200 p-8">
                    <i-material-symbols-keyboard class="h-12 w-12" />
                    <AGMarkdown lang-key="landing.moreKeyboard" class="text-lg" />
                </li>
            </ul>
        </div>
    </div>
</template>

<script setup lang="ts">
import { injectOrFail } from '@aerogel/core';
import { ref } from 'vue';

import { bindRefs, useElementScrollY } from '@/utils/composables';

import type { LandingContext } from './landing';

const $root = ref<HTMLElement>();
const context = injectOrFail<LandingContext>('landing');
const featuresScrollY = useElementScrollY($root, {
    scrollMarginTop: 120, // scroll-mt-32
});

bindRefs(featuresScrollY, context.featuresScrollY);
</script>
