import Aerogel, { AerogelResolver } from '@aerogel/vite';
import Components from 'unplugin-vue-components/vite';
import I18n from '@intlify/unplugin-vue-i18n/vite';
import Icons from 'unplugin-icons/vite';
import IconsResolver from 'unplugin-icons/resolver';
import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
    publicDir: resolve(__dirname, './src/assets/public/'),
    plugins: [
        Aerogel({ name: 'Solid Focus' }),
        Components({
            dts: false,
            resolvers: [AerogelResolver(), IconsResolver()],
            dirs: ['src/components', 'src/pages'],
        }),
        I18n({ include: resolve(__dirname, './src/lang/**/*.yaml') }),
        Icons({
            iconCustomizer(_, __, props) {
                props['aria-hidden'] = 'true';
            },
        }),
    ],
    resolve: {
        alias: {
            '@': resolve(__dirname, './src'),
        },
    },
});
