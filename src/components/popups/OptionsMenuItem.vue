<template>
    <MenuItem v-slot="{ active }">
        <AGHeadlessButton
            class="group flex w-full items-center rounded-lg px-2 py-2 text-sm text-gray-900"
            :class="active && 'bg-gray-100'"
        >
            <slot />
        </AGHeadlessButton>
    </MenuItem>
</template>
