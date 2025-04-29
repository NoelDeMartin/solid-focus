<template>
    <Setting
        v-if="$workspaces.usingLegacySchemas"
        :title="$t('settings.migrationTitle')"
        :description="$t('settings.migrationDescription')"
    >
        <Button
            variant="secondary"
            :disabled="!!$cloud.migrationDisabledReason"
            :title="$cloud.migrationDisabledReason"
            @click="($ui.closeAllModals(), $cloud.migrate())"
        >
            {{ $t('settings.migrate') }}
        </Button>
    </Setting>
</template>
