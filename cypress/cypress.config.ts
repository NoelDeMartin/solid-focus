import { setupAerogelNodeEvents } from '@aerogel/cypress/config';
import { defineConfig } from 'cypress';

export default defineConfig({
    e2e: {
        baseUrl: 'http://localhost:5001',
        video: false,
        scrollBehavior: false,
        retries: {
            runMode: 3,
            openMode: 0,
        },
        setupNodeEvents: setupAerogelNodeEvents,
    },
});
