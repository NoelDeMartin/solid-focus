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
        themeColor: '#00a86b',
        msTileColor: '#00a86b',
    },
};
