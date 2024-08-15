<template>
    <details class="group">
        <summary
            class="-ml-2 flex w-[max-content] cursor-pointer items-center rounded-lg py-2 pl-1 pr-3 hover:bg-gray-100 focus-visible:outline focus-visible:outline-gray-700"
        >
            <i-zondicons-cheveron-right class="h-6 w-6 transition-transform group-open:rotate-90" />
            <span>{{ $t('ui.advancedOptions') }}</span>
        </summary>

        <div class="pl-4 pt-2">
            <slot />
        </div>
    </details>
</template>
