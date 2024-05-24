import '@aerogel/histoire/dist/styles.css';
import { defineSetupAerogel } from '@aerogel/histoire';

import './assets/css/styles.css';

export const setupVue3 = defineSetupAerogel({
    messages: import.meta.glob('@/lang/*.yaml'),
});
