/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './index.html',
        './src/**/*.{vue,ts}',
        './node_modules/@aerogel/core/dist/**/*.js',
        './node_modules/@aerogel/plugin-solid/dist/**/*.js',
    ],
    plugins: [require('@tailwindcss/forms'), require('@tailwindcss/typography')],
};
