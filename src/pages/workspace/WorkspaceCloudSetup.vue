<template>
    <div class="text-center">
        <AGMarkdown lang-key="cloud.setup_info" />
        <div class="mt-4 flex flex-row-reverse justify-center gap-2">
            <AGButton @click="$ui.loading($cloud.setup())">
                {{ $t('cloud.setup') }}
            </AGButton>
            <AGLink @click="$cloud.dismissSetup()">
                {{ $t('cloud.setup_dismiss') }}
            </AGLink>
        </div>
    </div>
</template>
