import '@aerogel/histoire/dist/styles.css';
import { defineSetupAerogel } from '@aerogel/histoire';

import { WorkspacesService } from '@/services/Workspaces';

import './assets/css/main.css';
import { components } from './components';

export const setupVue3 = defineSetupAerogel({
    components,
    solid: true,
    models: import.meta.glob(['@/models/*', '!**/*.test.ts'], { eager: true }),
    messages: import.meta.glob('@/lang/*.yaml'),
    setup({ app }) {
        Object.assign(app.config.globalProperties, {
            $workspaces: new WorkspacesService(),
        });
    },
});
