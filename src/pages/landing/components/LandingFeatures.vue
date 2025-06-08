<template>
    <div ref="$rootRef" class="relative flex justify-center overflow-hidden pt-8">
        <div class="w-full max-w-(--breakpoint-lg) px-8">
            <div class="m-auto flex w-fit flex-col-reverse items-center gap-2 md:flex-row">
                <i-twemoji-thinking-face class="mr-16 size-20 md:mt-8 md:mr-0" />
                <span class="mr-2 size-4 self-center rounded-full bg-white md:mb-2" />
                <span class="size-4 self-center rounded-full bg-white md:mb-6" />
                <p class="self-start rounded-full bg-white px-8 py-4">
                    {{ $t('landing.featuresPrompt') }}
                </p>
            </div>

            <Markdown
                lang-key="landing.featuresIntro"
                class="mt-16 w-full text-center text-2xl font-light md:text-3xl"
                singleline
            />

            <div
                v-intersect="(visible: boolean) => after(700).then(() => (showWorkspaces ||= visible))"
                class="ease-spring mt-16 grid max-w-[780px] origin-center grid-cols-1 gap-x-12 gap-y-6 rounded-lg bg-white/25 px-12 py-8 transition-all duration-700 md:mt-32 md:grid-cols-[auto_1fr] md:grid-rows-[auto_1fr]"
                :class="
                    $ui.mobile
                        ? showWorkspaces
                            ? 'scale-100 opacity-100'
                            : 'scale-0 opacity-0'
                        : showWorkspaces
                            ? '-translate-x-[10%] opacity-100'
                            : '-translate-x-[90%] opacity-0'
                "
            >
                <h2
                    id="workspaces"
                    class="text-primary-900 scroll-mt-32 text-center text-3xl font-bold md:col-start-2 md:text-start"
                >
                    {{ $t('landing.workspacesTitle') }}
                </h2>
                <img
                    src="@/assets/img/landing/workspaces.png"
                    class="w-60 justify-self-center rounded-full md:row-span-2 md:row-start-1"
                    alt=""
                >
                <Markdown lang-key="landing.workspacesDescription" class="text-lg font-light" />
            </div>

            <div
                v-intersect="(visible: boolean) => after(700).then(() => (showLocalFirst ||= visible))"
                class="ease-spring mt-8 grid origin-center grid-cols-1 gap-x-12 gap-y-6 rounded-lg bg-white/25 px-12 py-8 transition-all duration-700 md:mt-16 md:mr-8 md:ml-40 md:grid-cols-[auto_1fr]"
                :class="
                    $ui.mobile
                        ? showLocalFirst
                            ? 'scale-100 opacity-100'
                            : 'scale-0 opacity-0'
                        : showLocalFirst
                            ? 'translate-x-[10%] opacity-100'
                            : 'translate-x-[90%] opacity-0'
                "
            >
                <h2 id="local-first" class="text-primary-900 scroll-mt-32 text-center text-3xl font-bold md:text-start">
                    {{ $t('landing.localFirstTitle') }}
                </h2>
                <i-oui-offline class="text-primary-900 size-40 justify-self-center md:row-span-2" />
                <Markdown lang-key="landing.localFirstDescription" class="text-lg font-light" />
            </div>

            <div
                v-intersect="(visible: boolean) => after(700).then(() => (showPWA ||= visible))"
                class="ease-spring mt-8 grid origin-center gap-8 rounded-lg bg-white/25 px-12 py-8 transition-all duration-700 md:mt-16 md:grid-cols-[1fr_2.75fr] md:gap-4"
                :class="showPWA ? 'scale-100 opacity-100' : 'scale-0 opacity-0'"
            >
                <h2 id="pwa" class="text-primary-900 scroll-mt-32 text-center text-3xl font-bold md:col-span-2">
                    {{ $t('landing.pwaTitle') }}
                </h2>
                <Markdown
                    lang-key="landing.pwaDescription"
                    class="max-w-full text-center text-lg font-light md:col-span-2"
                />
                <img
                    src="@/assets/img/landing/pwa-mobile.png"
                    alt=""
                    class="row-start-2 w-full rounded-sm border border-gray-200 md:row-start-auto"
                >
                <img
                    src="@/assets/img/landing/pwa-desktop.png"
                    alt=""
                    class="hidden w-full rounded-sm border border-gray-200 md:block"
                >
            </div>

            <div
                v-intersect="(visible: boolean) => after(700).then(() => (showSolid ||= visible))"
                class="ease-spring mt-8 grid max-w-[750px] origin-center grid-cols-1 gap-x-8 gap-y-6 rounded-lg bg-white/25 px-12 py-8 transition-all duration-700 md:mt-16 md:grid-cols-[auto_1fr] md:grid-rows-[auto_1fr]"
                :class="
                    $ui.mobile
                        ? showSolid
                            ? 'scale-100 opacity-100'
                            : 'scale-0 opacity-0'
                        : showSolid
                            ? '-translate-x-[10%] opacity-100'
                            : '-translate-x-[90%] opacity-0'
                "
            >
                <h2 id="solid" class="text-primary-900 scroll-mt-32 text-center text-3xl font-bold md:text-start">
                    {{ $t('landing.solidTitle') }}
                </h2>
                <i-app-solid class="size-52 justify-self-center md:row-span-2 md:row-start-1" />
                <Markdown lang-key="landing.solidDescription" class="text-lg font-light" />
            </div>

            <div
                v-intersect="(visible: boolean) => after(700).then(() => (showA11y ||= visible))"
                class="ease-spring mt-8 grid origin-center grid-cols-1 gap-6 rounded-lg bg-white/25 px-12 py-8 transition-all duration-700 md:mt-16 md:mr-12 md:ml-40 md:grid-cols-[1fr_auto] md:grid-rows-[auto_1fr]"
                :class="
                    $ui.mobile
                        ? showA11y
                            ? 'scale-100 opacity-100'
                            : 'scale-0 opacity-0'
                        : showA11y
                            ? 'translate-x-[10%] opacity-100'
                            : 'translate-x-[90%] opacity-0'
                "
            >
                <h2 id="a11y" class="text-primary-900 scroll-mt-32 text-center text-3xl font-bold md:text-start">
                    {{ $t('landing.a11yTitle') }}
                </h2>
                <i-twemoji-globe-showing-europe-africa class="size-40 justify-self-center md:row-span-2" />
                <Markdown
                    lang-key="landing.a11yDescription"
                    :lang-params="{ sourceUrl: $app.sourceUrl }"
                    class="text-lg font-light"
                />
            </div>

            <h2
                id="more"
                v-intersect="(visible: boolean) => after(700).then(() => (showMore ||= visible))"
                class="ease-spring mt-16 origin-center text-center text-3xl font-light transition-all duration-700 md:mt-32 md:text-2xl"
                :class="showMore ? 'scale-100 opacity-100' : 'scale-0 opacity-0'"
            >
                {{ $t('landing.more') }}
            </h2>

            <ul
                role="list"
                class="text-primary-900 [&_a]:text-primary-950 mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3"
            >
                <li
                    class="ease-spring bg-primary-200/25 flex flex-col items-center gap-y-2 rounded-lg p-8 transition-all duration-[1200ms]"
                    :class="showMore ? 'translate-y-0 opacity-100' : '-translate-y-[90%] opacity-0'"
                >
                    <i-ion-logo-markdown class="size-12" />
                    <Markdown lang-key="landing.moreMarkdown" class="text-primary-950 text-lg" />
                </li>
                <li
                    class="ease-spring bg-primary-200/25 flex flex-col items-center gap-y-2 rounded-lg p-8 transition-all delay-100 duration-[1200ms]"
                    :class="showMore ? 'translate-y-0 opacity-100' : '-translate-y-[90%] opacity-0'"
                >
                    <i-material-symbols-edit-document-rounded class="size-12" />
                    <Markdown lang-key="landing.moreScratchpad" class="text-primary-950 text-lg" />
                </li>
                <li
                    class="ease-spring bg-primary-200/25 flex flex-col items-center gap-y-2 rounded-lg p-8 transition-all delay-200 duration-[1200ms]"
                    :class="showMore ? 'translate-y-0 opacity-100' : '-translate-y-[90%] opacity-0'"
                >
                    <i-material-symbols-calendar-clock-rounded class="size-12" />
                    <Markdown lang-key="landing.moreDeadlines" class="text-primary-950 text-lg" />
                </li>
                <li
                    class="ease-spring bg-primary-200/25 flex flex-col items-center gap-y-2 rounded-lg p-8 transition-all delay-300 duration-[1200ms]"
                    :class="showMore ? 'translate-y-0 opacity-100' : '-translate-y-[90%] opacity-0'"
                >
                    <i-ic-sharp-star class="size-12" />
                    <Markdown lang-key="landing.moreImportant" class="text-primary-950 text-lg" />
                </li>
                <li
                    class="ease-spring bg-primary-200/25 flex flex-col items-center gap-y-2 rounded-lg p-8 transition-all delay-[400ms] duration-[1200ms]"
                    :class="showMore ? 'translate-y-0 opacity-100' : '-translate-y-[90%] opacity-0'"
                >
                    <i-material-symbols-search-rounded class="size-12" />
                    <Markdown lang-key="landing.moreSearch" class="text-primary-950 text-lg" />
                </li>
                <li
                    class="ease-spring bg-primary-200/25 flex flex-col items-center gap-y-2 rounded-lg p-8 transition-all delay-500 duration-[1200ms]"
                    :class="showMore ? 'translate-y-0 opacity-100' : '-translate-y-[90%] opacity-0'"
                >
                    <i-material-symbols-keyboard class="size-12" />
                    <Markdown lang-key="landing.moreKeyboard" class="text-primary-950 text-lg" />
                </li>
            </ul>
        </div>
    </div>
</template>

<script setup lang="ts">
import { after } from '@noeldemartin/utils';
import { injectOrFail } from '@aerogel/core';
import { ref, useTemplateRef } from 'vue';

import { bindRefs, useElementScrollY } from '@/utils/composables';

import type { LandingContext } from '@/pages/landing/landing';

const $root = useTemplateRef('$rootRef');
const showWorkspaces = ref(false);
const showLocalFirst = ref(false);
const showPWA = ref(false);
const showSolid = ref(false);
const showA11y = ref(false);
const showMore = ref(false);
const context = injectOrFail<LandingContext>('landing');
const featuresScrollY = useElementScrollY($root, {
    scrollMarginTop: 120, // scroll-mt-32
});

bindRefs(featuresScrollY, context.featuresScrollY);
</script>
