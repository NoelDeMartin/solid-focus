<template>
    <div ref="$rootRef" class="relative flex justify-center pt-8">
        <div class="w-full max-w-(--breakpoint-lg) px-8">
            <div class="m-auto flex w-fit gap-2">
                <i-twemoji-thinking-face class="mt-8 size-20" />
                <span class="mb-2 size-4 self-center rounded-full bg-white" />
                <span class="mb-6 size-4 self-center rounded-full bg-white" />
                <p class="self-start rounded-full bg-white p-4">
                    {{ $t('landing.featuresPrompt') }}
                </p>
            </div>

            <Markdown
                lang-key="landing.featuresIntro"
                class="mt-16 w-full text-center text-2xl font-light"
                singleline
            />

            <div class="mt-32 ml-auto flex w-fit gap-8">
                <img src="@/assets/img/landing/workspaces.png" alt="" class="w-60 rounded-full">
                <div class="max-w-[550px]">
                    <h2 id="workspaces" class="text-primary-900 scroll-mt-32 text-3xl font-bold">
                        {{ $t('landing.workspacesTitle') }}
                    </h2>
                    <Markdown lang-key="landing.workspacesDescription" class="mt-8 text-lg font-light" />
                </div>
            </div>

            <div class="mt-32 ml-16 flex gap-8">
                <div class="max-w-[500px]">
                    <h2 id="local-first" class="text-primary-900 scroll-mt-32 text-3xl font-bold">
                        {{ $t('landing.localFirstTitle') }}
                    </h2>
                    <Markdown lang-key="landing.localFirstDescription" class="mt-8 text-lg font-light" />
                </div>
                <i-twemoji-locked-with-key class="size-40" />
            </div>

            <div class="mt-32 flex flex-col items-center">
                <h2 id="pwa" class="text-primary-900 scroll-mt-32 text-3xl font-bold">
                    {{ $t('landing.pwaTitle') }}
                </h2>
                <Markdown lang-key="landing.pwaDescription" class="mt-8 max-w-full text-lg font-light" />

                <div class="mt-8 flex items-center justify-center gap-4">
                    <div class="flex-1">
                        <img
                            src="@/assets/img/landing/pwa-mobile.png"
                            alt=""
                            class="w-full rounded-sm border border-gray-200"
                        >
                    </div>
                    <div class="flex-[2.77]">
                        <img
                            src="@/assets/img/landing/pwa-desktop.png"
                            alt=""
                            class="w-full rounded-sm border border-gray-200"
                        >
                    </div>
                </div>
            </div>

            <div class="mt-32 flex w-fit gap-8">
                <i-app-solid class="size-52" />
                <div class="max-w-[550px]">
                    <h2 id="solid" class="text-primary-900 scroll-mt-32 text-3xl font-bold">
                        {{ $t('landing.solidTitle') }}
                    </h2>
                    <Markdown lang-key="landing.solidDescription" class="mt-8 text-lg font-light" />
                </div>
            </div>

            <div class="mt-32 ml-16 flex gap-8">
                <div class="max-w-[550px]">
                    <h2 id="a11y" class="text-primary-900 scroll-mt-32 text-3xl font-bold">
                        {{ $t('landing.a11yTitle') }}
                    </h2>
                    <Markdown
                        lang-key="landing.a11yDescription"
                        :lang-params="{ sourceUrl: $app.sourceUrl }"
                        class="mt-8 text-lg font-light"
                    />
                </div>
                <i-twemoji-globe-showing-europe-africa class="size-40" />
            </div>

            <h2 class="text-primary-900 mt-32 text-center text-3xl font-bold">
                {{ $t('landing.more') }}
            </h2>

            <ul role="list" class="mt-6 grid grid-cols-3 gap-6">
                <li class="flex flex-col items-center gap-y-2 rounded-sm bg-gray-200 p-8">
                    <i-ion-logo-markdown class="size-12" />
                    <Markdown lang-key="landing.moreMarkdown" class="text-lg" />
                </li>
                <li class="flex flex-col items-center gap-y-2 rounded-sm bg-gray-200 p-8">
                    <i-material-symbols-edit-document-rounded class="size-12" />
                    <Markdown lang-key="landing.moreScratchpad" class="text-lg" />
                </li>
                <li class="flex flex-col items-center gap-y-2 rounded-sm bg-gray-200 p-8">
                    <i-material-symbols-calendar-clock-rounded class="size-12" />
                    <Markdown lang-key="landing.moreDeadlines" class="text-lg" />
                </li>
                <li class="flex flex-col items-center gap-y-2 rounded-sm bg-gray-200 p-8">
                    <i-ic-sharp-star class="size-12" />
                    <Markdown lang-key="landing.moreStarred" class="text-lg" />
                </li>
                <li class="flex flex-col items-center gap-y-2 rounded-sm bg-gray-200 p-8">
                    <i-material-symbols-search-rounded class="size-12" />
                    <Markdown lang-key="landing.moreSearch" class="text-lg" />
                </li>
                <li class="flex flex-col items-center gap-y-2 rounded-sm bg-gray-200 p-8">
                    <i-material-symbols-keyboard class="size-12" />
                    <Markdown lang-key="landing.moreKeyboard" class="text-lg" />
                </li>
            </ul>
        </div>
    </div>
</template>

<script setup lang="ts">
import { injectOrFail } from '@aerogel/core';
import { useTemplateRef } from 'vue';

import { bindRefs, useElementScrollY } from '@/utils/composables';

import type { LandingContext } from './landing';

const $root = useTemplateRef('$rootRef');
const context = injectOrFail<LandingContext>('landing');
const featuresScrollY = useElementScrollY($root, {
    scrollMarginTop: 120, // scroll-mt-32
});

bindRefs(featuresScrollY, context.featuresScrollY);
</script>
