'use strict';

module.exports = {
    parser: 'babel-eslint',
    'env': {
        'browser': true,
        'es6': true,
    },
    'extends': 'eslint:recommended',
    'rules': {
        'indent': ['error', 4],
        'linebreak-style': ['error', 'unix'],
        'quotes': ['error', 'single'],
        'semi': ['error', 'always'],
        'comma-dangle': ['error', 'always-multiline'],
        'no-console': ['off'],
        'no-extra-semi': ['off'],
    },
};