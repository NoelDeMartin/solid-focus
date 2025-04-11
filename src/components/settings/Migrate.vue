<template>
    <div v-if="$workspaces.usingLegacySchemas" class="mt-4 flex flex-row">
        <div class="flex-grow">
            <h3 class="text-base font-semibold">
                {{ $t('settings.migrationTitle') }}
            </h3>
            <Markdown :text="$t('settings.migrationDescription')" class="mt-1 text-sm text-gray-500" />
        </div>
        <Button
            variant="secondary"
            class="self-center"
            :disabled="!!$cloud.migrationDisabledReason"
            :title="$cloud.migrationDisabledReason"
            @click="($ui.closeAllModals(), $cloud.migrate())"
        >
            {{ $t('settings.migrate') }}
        </Button>
    </div>
</template>
