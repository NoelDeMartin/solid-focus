<template>
    <AGModal>
        <AGSolidStatus />

        <div v-if="$cloud.setupDismissed" class="mt-4 flex flex-col items-center border-t border-t-gray-300 pt-2">
            <AGMarkdown lang-key="cloud.setup_info" />
            <AGButton class="mt-2">
                {{ $t('cloud.setup_confirm') }}
            </AGButton>
        </div>

        <AGButton v-if="$cloud.online" class="mt-4" @click="$cloud.sync()">
            {{ $t('cloud.sync') }}
        </AGButton>
    </AGModal>
</template>
