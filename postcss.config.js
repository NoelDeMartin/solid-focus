const plugins = {
    tailwindcss: {},
    autoprefixer: {},
};

if (process.env.NODE_ENV === 'development') {
    plugins['postcss-pseudo-classes'] = {
        blacklist: [],
        restrictTo: ['focus', 'focus-visible', 'focus-within', 'hover'],
        allCombinations: true,
        preserveBeforeAfter: false,
    };
}

export default { plugins };
