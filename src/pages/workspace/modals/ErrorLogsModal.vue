<template>
    <FloatingModal :title="$t('errors.logs')">
        <ol>
            <li
                v-for="(log, index) of $errors.logs"
                :key="index"
                class="mb-2 flex max-w-prose min-w-56 justify-between py-2 last:mb-0"
            >
                <div>
                    <h3 class="font-medium">
                        {{ log.report.title }}
                    </h3>
                    <time :datetime="log.date.toISOString()" class="text-xs text-gray-700">
                        {{ log.date.toLocaleTimeString() }}
                    </time>
                    <Markdown
                        class="text-sm text-gray-500"
                        :text="log.report.description ?? getErrorMessage(log.report)"
                    />
                </div>
                <IconButton
                    :aria-label="$t('errors.viewDetails')"
                    :title="$t('errors.viewDetails')"
                    class="self-center"
                    @click="$errors.inspect(log.report)"
                >
                    <i-zondicons-view-show class="size-4" aria-hidden="true" />
                </IconButton>
            </li>
        </ol>
    </FloatingModal>
</template>

<script setup lang="ts">
import { getErrorMessage } from '@aerogel/core';
</script>
