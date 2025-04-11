<template>
    <div class="flex grow flex-col items-center justify-center p-8 text-center">
        <template v-if="$cloud.migrating">
            <h1>{{ $t('cloud.migrate.ongoing') }}</h1>
            <ProgressBar bar-class="bg-primary-600" class="mt-2 min-w-[min(400px,80vw)]" :job="$cloud.migrationJob" />
        </template>
        <template v-else-if="interrupted">
            <h1 class="mt-4 text-3xl font-semibold">
                {{ $t('cloud.migrate.interruptedTitle') }}
            </h1>
            <Markdown
                lang-key="cloud.migrate.interruptedMessage"
                class="mt-2 text-left text-lg font-light text-gray-600"
            />
            <Link
                class="mt-2 flex items-center self-end text-sm"
                :url="`${$app.sourceUrl}/blob/main/docs/migrate-schema.md`"
            >
                <span>{{ $t('cloud.migrate.learnMore') }}</span>
                <i-zondicons-arrow-right class="ml-1.5 size-2.5" />
            </Link>
            <div class="mt-4 flex flex-row-reverse justify-center gap-2">
                <Button @click="$cloud.migrate()">
                    {{ $t('cloud.migrate.continue') }}
                </Button>
                <Button variant="secondary" @click="$cloud.postponeMigration()">
                    {{ $t('cloud.migrate.postpone') }}
                </Button>
            </div>
        </template>
        <template v-else>
            <h1 class="mt-4 text-3xl font-semibold">
                {{ $t('cloud.migrate.title') }}
            </h1>
            <Markdown lang-key="cloud.migrate.message" class="mt-2 text-left text-lg font-light text-gray-600" />
            <Link
                class="mt-2 flex items-center self-end text-sm"
                :url="`${$app.sourceUrl}/blob/main/docs/migrate-schema.md`"
            >
                <span>{{ $t('cloud.migrate.learnMore') }}</span>
                <i-zondicons-arrow-right class="ml-1.5 size-2.5" />
            </Link>
            <div class="mt-4 flex flex-row-reverse justify-center gap-2">
                <Button @click="$cloud.migrate()">
                    {{ $t('cloud.migrate.submit') }}
                </Button>
                <Button variant="secondary" @click="dismiss()">
                    {{ $t('cloud.migrate.dismiss') }}
                </Button>
            </div>
        </template>
    </div>
</template>

<script setup lang="ts">
import { Cloud } from '@aerogel/plugin-local-first';
import { computed } from 'vue';
import { UI, translate } from '@aerogel/core';

const interrupted = computed(() => Cloud.migrationJob && !Cloud.migrating);

async function dismiss() {
    await UI.confirm(translate('cloud.migrate.dismissTitle'), translate('cloud.migrate.dismissMessage'), {
        required: true,
    });

    Cloud.dismissMigration();
}
</script>
