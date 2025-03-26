import { URL, fileURLToPath } from 'node:url';

import Aerogel, { AerogelResolver } from '@aerogel/vite';
import Components from 'unplugin-vue-components/vite';
import I18n from '@intlify/unplugin-vue-i18n/vite';
import Icons from 'unplugin-icons/vite';
import IconsResolver from 'unplugin-icons/resolver';
import { defineConfig } from 'vitest/config';
import { FileSystemIconLoader } from 'unplugin-icons/loaders';
import { HeadlessUiResolver } from 'unplugin-vue-components/resolvers';

export default defineConfig({
    build: { sourcemap: true },
    publicDir: fileURLToPath(new URL('./src/assets/public/', import.meta.url)),
    plugins: [
        Aerogel({
            name: 'Focus',
            description: 'Your distraction-free Task Manager',
            baseUrl: 'https://focus.noeldemartin.com',
            themeColor: '#0ea5e9',
            icons: {
                '192x192': 'android-chrome-192x192.png',
                '512x512': 'android-chrome-512x512.png',
            },
        }),
        Components({
            deep: true,
            dts: false,
            resolvers: [HeadlessUiResolver(), AerogelResolver(), IconsResolver({ customCollections: ['app'] })],
            dirs: ['src/components', 'src/pages'],
        }),
        I18n({ strictMessage: false, include: fileURLToPath(new URL('./src/lang/**/*.yaml', import.meta.url)) }),
        Icons({
            iconCustomizer(_, __, props) {
                props['aria-hidden'] = 'true';
            },
            customCollections: {
                app: FileSystemIconLoader('./src/assets/icons'),
            },
        }),
    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src/', import.meta.url)),
        },
    },
});
