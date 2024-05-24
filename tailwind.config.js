/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './index.html',
        './src/**/*.{vue,ts}',
        './node_modules/@aerogel/core/dist/**/*.js',
        './node_modules/@aerogel/plugin-solid/dist/**/*.js',
        './node_modules/@aerogel/histoire/dist/**/*.js',
    ],
    plugins: [require('@tailwindcss/forms'), require('@tailwindcss/typography')],
    theme: {
        fontFamily: {
            onest: '"Onest", sans-serif',
        },
        extend: {
            boxShadow: {
                panel: '0 0 15px -3px rgb(0 0 0 / 0.1), 0 0 6px -4px rgb(0 0 0 / 0.1)',
            },
        },
    },
};
