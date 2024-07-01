<template>
    <OptionsMenu
        :options="[
            { text: $t('user.logIn'), click: () => $ui.openModal(CloudLoginModal) },
            { text: $t('user.settings'), click: () => $ui.openModal(UserSettingsModal) },
        ]"
    >
        <IconButton :as="MenuButton" :aria-label="$t('user.menu')" :title="$t('user.menu')">
            <i-zondicons-cog class="h-5 w-5" />
        </IconButton>
    </OptionsMenu>
</template>

<script setup lang="ts">
import { MenuButton } from '@headlessui/vue';

import CloudLoginModal from '../../modals/CloudLoginModal.vue';
import UserSettingsModal from '../../modals/UserSettingsModal.vue';
</script>
