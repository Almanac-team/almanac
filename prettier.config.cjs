/** @type {import('prettier').Config} */
const config = {
    semi: true,
    trailingComma: 'es5',
    singleQuote: true,
    tabWidth: 4,
    useTabs: false,
    plugins: [require.resolve('prettier-plugin-tailwindcss')],
};

module.exports = config;
