<template>
    <div class="fixed top-0 left-0 z-20 w-full">
        <div class="mx-8">
            <div class="m-auto flex h-20 max-w-(--breakpoint-xl) items-center justify-center py-8 md:justify-between">
                <div ref="$headerLogoRef" class="aspect-5/2 h-12" />
                <div
                    ref="$headerCTAsRef"
                    :style="{ width: `${ctaSize?.width}px`, height: `${ctaSize?.height}px` }"
                    class="hidden md:block"
                />
            </div>
        </div>
    </div>

    <div class="relative flex h-screen w-full flex-col items-center justify-center text-center">
        <div
            class="duration-landing-form transition-margin flex flex-col items-center"
            :style="{ marginTop: `${wrapperTranslateY}px` }"
        >
            <ScrollTransition
                ref="$logoRef"
                class="z-30 flex aspect-5/2 h-24 items-center justify-center"
                fill="forwards"
                :morph-to="$headerLogo"
                :end="featuresScrollY"
                :style="headerItemStyles"
            >
                <button
                    type="button"
                    tabindex="-1"
                    class="size-full"
                    @click="scrollToHero()"
                >
                    <i-app-logo class="size-full" />
                </button>
            </ScrollTransition>
            <h1 class="sr-only">
                {{ $t('landing.title') }}
            </h1>
            <div
                class="duration-landing-form relative flex w-full items-center justify-center transition-all"
                :style="contentStyles"
            >
                <TransitionGroup
                    enter-active-class="transition-all ease-in-out duration-landing-form"
                    :enter-from-class="`${content !== 'initial' ? 'translate-x-full' : '-translate-x-full'} opacity-0`"
                    enter-to-class="translate-x-0 opacity-100"
                    leave-active-class="transition-all ease-in-out duration-landing-form"
                    leave-from-class="translate-x-0 opacity-100"
                    :leave-to-class="`${content !== 'initial' ? '-translate-x-full' : 'translate-x-full'} opacity-0`"
                    :duration="FORM_ANIMATION_DURATION"
                >
                    <LandingSyncing v-if="$cloud.syncing || $cloud.syncJob" />
                    <div
                        v-else-if="content === 'initial'"
                        v-measure="(size: ElementSize) => (initialContentSize ??= size)"
                        class="z-40 md:absolute md:top-0 md:whitespace-nowrap"
                    >
                        <ScrollTransition
                            ref="$introRef"
                            disappear
                            fill="forwards"
                            :end="featuresScrollY && featuresScrollY / 4"
                        >
                            <p class="text-primary-950 mt-2 text-3xl font-medium tracking-tight">
                                {{ $t('landing.tagline') }}
                            </p>
                            <Markdown
                                lang-key="landing.description"
                                class="mt-4 rounded-sm bg-white/50 px-3 text-lg leading-8 text-gray-600"
                            />
                        </ScrollTransition>
                        <div class="mt-4 flex justify-center">
                            <ScrollTransition
                                ref="$ctasRef"
                                class="z-30"
                                fill="forwards"
                                :disappear="$ui.mobile"
                                :morph-to="$ui.desktop && $headerCTAs"
                                :end="featuresScrollY && ($ui.mobile ? featuresScrollY / 4 : featuresScrollY)"
                                :style="$ui.desktop && headerItemStyles"
                            >
                                <div
                                    v-measure="(size: ElementSize) => (ctaSize ??= size)"
                                    class="flex items-center justify-center gap-x-3"
                                >
                                    <Button
                                        class="px-3.5 py-2.5 text-sm font-semibold"
                                        @click="$events.emit('landing:get-started')"
                                    >
                                        {{ $t('landing.getStarted.cta') }}
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        class="bg-white/50 px-3.5 py-2.5 text-sm font-semibold"
                                        @click="$events.emit('landing:log-in')"
                                    >
                                        <span>{{ $t('landing.logIn.cta') }}</span>
                                        <i-zondicons-arrow-right class="ml-1.5 size-3" />
                                    </Button>
                                </div>
                            </ScrollTransition>
                        </div>
                    </div>
                    <div
                        v-else-if="content === 'get-started'"
                        v-measure="(size: ElementSize) => (getStartedFormSize ??= size)"
                        :class="{ 'absolute top-0': !$solid.hasLoggedIn() }"
                    >
                        <LandingGetStarted />
                    </div>
                    <div
                        v-else-if="content === 'log-in'"
                        v-measure="(size: ElementSize) => (logInFormSize = size)"
                        class="absolute top-0"
                    >
                        <LandingLogIn />
                    </div>
                </TransitionGroup>
            </div>
        </div>
    </div>

    <ScrollTransition
        ref="$arrowRef"
        disappear
        fill="forwards"
        class="absolute bottom-0 left-1/2 z-30 -translate-x-1/2"
        :end="windowDimensions.height / 2"
    >
        <Button
            size="icon"
            variant="ghost"
            class="duration-landing-form hover:bg-background/50 animate-bounce p-0 transition-opacity"
            :class="showingForm ? 'opacity-0' : 'opacity-100'"
            @click="showFeatures()"
        >
            <i-zondicons-cheveron-down class="size-12" />
        </Button>
    </ScrollTransition>

    <div
        class="duration-landing-form pointer-events-none relative isolate mt-[5vw] w-full transition-transform will-change-transform"
        :style="{ transform: `translateY(${showingForm ? '100%' : '0%'})` }"
    >
        <LandingTreesImage class="relative top-1 z-10 w-full" />
        <LandingMountainsImage
            class="absolute left-0 z-0 hidden w-full will-change-transform md:block"
            :style="{
                transform: `translateY(${backgroundTranslateY}px)`,
                top: `calc(${MOUNTAINS_ASPECT_RATIO} * -100vw)`,
            }"
        />
        <LandingMountainsMobileImage
            class="absolute top-[-40vh] left-0 z-0 w-full will-change-transform sm:top-[-50vh] md:hidden"
            :style="{ transform: `translateY(${backgroundTranslateY}px)` }"
        />
        <LandingMeadowImage
            class="absolute left-0 z-0 hidden w-full will-change-transform md:block"
            :style="{
                transform: `translateY(${backgroundTranslateY * 0.5}px)`,
                top: `calc(${MEADOW_ASPECT_RATIO} * -100vw)`,
            }"
        />
    </div>
</template>

<script setup lang="ts">
import { animate, easeInOut } from 'popmotion';
import { computed, onMounted, ref, useTemplateRef } from 'vue';
import { Events, UI, injectOrFail, useEvent } from '@aerogel/core';
import { Solid } from '@aerogel/plugin-solid';
import type { CSSProperties } from 'vue';
import type { ElementSize } from '@aerogel/core';

import { useScrollY, useWindowDimensions } from '@/utils/composables';

import {
    MEADOW_ASPECT_RATIO,
    MOUNTAINS_ASPECT_RATIO,
    MOUNTAINS_HERO_ASPECT_RATIO,
    SKY_HERO_HEIGHT,
} from '@/pages/landing/landing';
import { FORM_ANIMATION_DURATION, heroicEntrance, scrollToHero } from '@/pages/landing/animations';
import type { LandingContext } from '@/pages/landing/landing';

const { featuresScrollY, showingForm, showingCallout } = injectOrFail<LandingContext>('landing');
const $headerLogo = useTemplateRef('$headerLogoRef');
const $headerCTAs = useTemplateRef('$headerCTAsRef');
const $logo = useTemplateRef('$logoRef');
const $intro = useTemplateRef('$introRef');
const $ctas = useTemplateRef('$ctasRef');
const $arrow = useTemplateRef('$arrowRef');
const initialContentSize = ref<ElementSize>();
const ctaSize = ref<ElementSize>();
const getStartedFormSize = ref<ElementSize>();
const logInFormSize = ref<ElementSize>();
const windowDimensions = useWindowDimensions();
const content = ref<'initial' | 'get-started' | 'log-in'>(Solid.hasLoggedIn() ? 'get-started' : 'initial');
const scrollY = useScrollY();
const formAnimationDuration = ref(`${FORM_ANIMATION_DURATION}ms`);
const contentStyles = computed(() => {
    if (Solid.hasLoggedIn()) {
        return '';
    }

    return {
        'initial': {
            width: `${initialContentSize.value?.width}px`,
            height: `${initialContentSize.value?.height}px`,
        },
        'get-started': {
            width: `${getStartedFormSize.value?.width}px`,
            height: `${getStartedFormSize.value?.height}px`,
        },
        'log-in': {
            width: `${logInFormSize.value?.width}px`,
            height: `${logInFormSize.value?.height}px`,
        },
    }[content.value];
});
const backgroundTranslateY = computed(() => {
    if (!featuresScrollY.value) {
        return 0;
    }

    return Math.min(featuresScrollY.value / 2, scrollY.value / 2);
});
const wrapperTranslateY = computed(() => {
    if (showingForm.value) {
        return 0;
    }

    if (UI.mobile) {
        return -SKY_HERO_HEIGHT;
    }

    const mountainsHeight = window.innerWidth * MOUNTAINS_HERO_ASPECT_RATIO;

    return (window.innerHeight - mountainsHeight - SKY_HERO_HEIGHT) / 2 + SKY_HERO_HEIGHT - window.innerHeight / 2;
});
const headerItemStyles = computed(() => {
    const styles: CSSProperties = { transition: 'opacity 600ms' };

    if (showingCallout.value) {
        styles.opacity = '0';
        styles.pointerEvents = 'none';
    }

    return styles;
});

function showFeatures() {
    animate({
        from: window.scrollY,
        to: featuresScrollY.value ?? window.innerHeight,
        duration: 1500,
        ease: easeInOut,
        onUpdate: (value) => window.scrollTo({ top: value }),
    });
}

async function showForm(name: 'get-started' | 'log-in') {
    await scrollToHero();

    showingForm.value = true;
    content.value = name;
}

async function hideForm() {
    content.value = 'initial';
    showingForm.value = false;

    $arrow.value?.$el?.animate([{ opacity: 0 }, { opacity: 1 }], {
        delay: 500,
        duration: 500,
        easing: 'ease-in',
        fill: 'forwards',
    });
}

onMounted(async () => {
    await heroicEntrance([$logo, $intro, $ctas], $arrow);

    Events.emit('landing:ready');
});

useEvent('landing:get-started', () => showForm('get-started'));
useEvent('landing:log-in', () => showForm('log-in'));
useEvent('landing:reset', hideForm);
</script>

<style scoped>
.duration-landing-form {
    transition-duration: v-bind(formAnimationDuration);
}
</style>
