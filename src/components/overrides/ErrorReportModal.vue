<template>
    <FloatingModal>
        <div class="flex items-center">
            <AGErrorReportModalTitle
                class="text-lg font-semibold leading-6 text-gray-900"
                :report="report"
                :current-report="activeReportIndex + 1"
                :total-reports="reports.length"
            />
            <IconButton
                v-if="reports.length > 1"
                class="ml-1"
                :title="previousReportText"
                :aria-label="previousReportText"
                :disabled="activeReportIndex === 0"
                @click="activeReportIndex--"
            >
                <i-zondicons-cheveron-left class="h-5 w-5" />
            </IconButton>
            <IconButton
                v-if="reports.length > 1"
                :title="nextReportText"
                :aria-label="nextReportText"
                :disabled="activeReportIndex === reports.length - 1"
                @click="activeReportIndex++"
            >
                <i-zondicons-cheveron-right class="h-5 w-5" />
            </IconButton>
            <div class="flex-1" />
            <AGErrorReportModalButtons :report="report">
                <template
                    #default="{ url, handler, iconComponent, description }: IAGErrorReportModalButtonsDefaultSlotProps"
                >
                    <IconButton
                        :url="url"
                        :title="description"
                        :aria-label="description"
                        @click="handler"
                    >
                        <component :is="iconComponent" class="h-5 w-5" />
                    </IconButton>
                </template>
            </AGErrorReportModalButtons>
        </div>
        <AGMarkdown v-if="report.description" :text="report.description" />
        <pre class="mt-4 max-h-[80vh] overflow-auto rounded-lg bg-red-50 p-2 text-sm text-red-900" v-text="details" />
    </FloatingModal>
</template>

<script setup lang="ts">
import { useErrorReportModal, useErrorReportModalProps } from '@aerogel/core';
import type { IAGErrorReportModalButtonsDefaultSlotProps } from '@aerogel/core';

const props = defineProps(useErrorReportModalProps());
const { activeReportIndex, details, nextReportText, previousReportText, report } = useErrorReportModal(props);
</script>
