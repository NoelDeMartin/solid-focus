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
