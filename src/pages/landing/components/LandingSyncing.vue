<template>
    <div class="mt-4 max-w-full sm:mt-8">
        <div v-if="$cloud.syncing" class="flex flex-col items-center">
            <div class="mt-2 flex items-center gap-2">
                <i-svg-spinners-90-ring-with-bg class="text-primary-500 size-8" />
                <Markdown
                    lang-key="landing.syncing.title"
                    :lang-params="{ progress: syncProgress }"
                    class="text-lg text-gray-600"
                />
            </div>
            <ProgressBar v-if="$cloud.syncJob" :job="$cloud.syncJob" class="mt-4 min-w-[min(400px,80vw)]" />
            <Button
                v-if="$cloud.syncJob"
                variant="secondary"
                :disabled="cancellingSync"
                class="mt-2"
                @click="stop()"
            >
                <i-ic-baseline-stop class="size-5" />
                {{ cancellingSync ? $t('cloud.stopping') : $t('cloud.stop') }}
            </Button>
        </div>

        <div v-else class="flex flex-col items-center">
            <h1 class="mt-4 text-3xl font-semibold">
                {{ $t('landing.syncing.syncCancelledTitle') }}
            </h1>
            <Markdown lang-key="landing.syncing.syncCancelledMessage" class="mt-2 text-lg font-light text-gray-600" />
            <div class="mt-4 flex flex-row-reverse justify-center gap-2">
                <Button @click="$cloud.sync()">
                    {{ $t('landing.syncing.syncCancelledResume') }}
                </Button>
                <Button variant="secondary" @click="cancel()">
                    {{ $t('landing.syncing.syncCancelledLogout') }}
                </Button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { Cloud } from '@aerogel/plugin-local-first';
import { computed, ref } from 'vue';
import { Solid } from '@aerogel/plugin-solid';

const cancellingSync = ref(false);
const syncProgress = computed(() => Math.floor(100 * (Cloud.syncJob?.progress ?? 0)));

async function stop() {
    if (!Cloud.syncJob) {
        return;
    }

    cancellingSync.value = true;

    await Promise.race([Cloud.syncJob.cancel(), Cloud.syncJob.completed]);

    cancellingSync.value = false;
}

async function cancel() {
    Cloud.syncJob = null;

    await Solid.logout(true);
}
</script>
