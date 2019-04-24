module.exports = {
    resolve: {
        extensions: ['.ts', '.js'],
        alias: {
            '@cy': __dirname,
        },
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                exclude: [/node_modules/],
                use: [{
                    loader: 'ts-loader',
                }],
            },
        ],
    },
};
