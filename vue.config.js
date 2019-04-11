const path = require('path');
const version = require('./package.json').version;

process.env.VUE_APP_VERSION = version;

module.exports = {
    baseUrl: process.env.NODE_ENV === 'production'
        ? '/solid-focus/'
        : '/',
    configureWebpack: {
        externals: {
            'node-fetch': 'fetch',
            'text-encoding': 'TextEncoder',
            'whatwg-url': 'window',
            'isomorphic-fetch': 'fetch',
            '@trust/webcrypto': 'crypto',
        },
        resolve: {
            alias: process.env.NODE_ENV === 'development'
                ? {
                    // This is necessary to use npm link for development:
                    // https://stackoverflow.com/questions/31169760/how-to-avoid-react-loading-twice-with-webpack-when-developing
                    soukai: path.resolve('./node_modules/soukai'),
                }
                : {},
        },
    },
    chainWebpack: (config) => {
        // This is necessary to use npm link for development:
        // https://cli.vuejs.org/guide/troubleshooting.html#symbolic-links-in-node-modules
        if (process.env.NODE_ENV === 'development') {
            config.resolve.symlinks(false);
        }
    },
    pwa: {
        name: 'Solid Focus',
        themeColor: '#4dba87',
        msTileColor: '#4dba87',
        manifestOptions: {
            background_color: '#ffffff',
            orientation: 'portrait',
            version,
        },
    },
};
