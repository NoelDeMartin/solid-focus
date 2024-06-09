import { UIComponents } from '@aerogel/core';

import AlertModal from './overrides/AlertModal.vue';
import ConfirmModal from './overrides/ConfirmModal.vue';
import ErrorReportModal from './overrides/ErrorReportModal.vue';
import LoadingModal from './overrides/LoadingModal.vue';
import PromptModal from './overrides/PromptModal.vue';
import SnackbarNotification from './overrides/SnackbarNotification.vue';

export const components = {
    [UIComponents.AlertModal]: AlertModal,
    [UIComponents.ConfirmModal]: ConfirmModal,
    [UIComponents.ErrorReportModal]: ErrorReportModal,
    [UIComponents.LoadingModal]: LoadingModal,
    [UIComponents.PromptModal]: PromptModal,
    [UIComponents.Snackbar]: SnackbarNotification,
};
