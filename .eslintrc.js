/** @type {import('eslint').Linter.Config} */
const config = {
    ignorePatterns: ['**/node_modules/**', '**/dist/**', '**/test/**', '**/build/**'],
    extends: ['iamyth/preset/node'],
    root: true,
};

module.exports = config;